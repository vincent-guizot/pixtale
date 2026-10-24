const { Op } = require('sequelize');
const db = require('../models');
const { Post, User, Category, Comment } = db;
const AppError = require('../utils/AppError');

// Subquery COUNT(*) ke tabel Likes, di-attach sebagai kolom virtual "likesCount"
const likesCountAttribute = [
  db.sequelize.literal(
    '(SELECT COUNT(*)::int FROM "Likes" WHERE "Likes"."postId" = "Post"."id")',
  ),
  'likesCount',
];

// Subquery EXISTS ke tabel Likes untuk mengecek apakah user yang sedang login sudah me-like post ini
const getIsLikedAttribute = (userId) => {
  if (!userId) {
    return [db.sequelize.literal('false'), 'isLiked'];
  }
  const cleanId = parseInt(userId, 10);
  return [
    db.sequelize.literal(
      `(SELECT EXISTS (SELECT 1 FROM "Likes" WHERE "Likes"."postId" = "Post"."id" AND "Likes"."userId" = ${cleanId}))`
    ),
    'isLiked',
  ];
};

class PostService {
  async findAll({ categoryId, userId, search, page, limit, currentUserId, feed } = {}) {
    const where = {};
    if (categoryId) {
      where.categoryId = Number(categoryId);
    }
    if (userId) {
      where.userId = Number(userId);
    }
    if (feed === 'following') {
      if (!currentUserId) {
        where.userId = -1;
      } else {
        const cleanCurrentUserId = parseInt(currentUserId, 10);
        const myFollows = await db.Follow.findAll({
          where: { followerId: cleanCurrentUserId },
          attributes: ['followingId'],
        });
        const followingIds = myFollows.map((item) => item.followingId);
        where.userId = { [Op.in]: followingIds };
      }
    }
    if (search && search.trim()) {
      where.caption = { [Op.iLike]: `%${search.trim()}%` };
    }

    const attributes = {
      include: [likesCountAttribute, getIsLikedAttribute(currentUserId)],
    };

    const include = [
      { model: User, attributes: ['id', 'username'] },
      { model: Category, attributes: ['id', 'name'] },
    ];

    const order = [['createdAt', 'DESC']];

    // Paginasi opsional
    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const offset = (pageNum - 1) * limitNum;

      const { count, rows } = await Post.findAndCountAll({
        where,
        attributes,
        include,
        order,
        limit: limitNum,
        offset,
        distinct: true,
      });

      return {
        posts: rows,
        pagination: {
          total: count,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(count / limitNum),
        },
      };
    }

    return Post.findAll({
      where,
      attributes,
      include,
      order,
    });
  }

  async findById(id, currentUserId = null) {
    const post = await this._getPostOr404(id, {
      attributes: {
        include: [likesCountAttribute, getIsLikedAttribute(currentUserId)],
      },
      include: [
        { model: User, attributes: ['id', 'username'] },
        { model: Category, attributes: ['id', 'name'] },
        {
          model: Comment,
          include: [{ model: User, attributes: ['id', 'username'] }],
        },
        {
          // Daftar user yang like post ini, lewat tabel junction Likes (Task 2, relasi M-N)
          model: User,
          as: 'likedBy',
          attributes: ['id', 'username'],
          through: { attributes: [] }, // sembunyikan kolom Likes.createdAt/updatedAt biar output bersih
        },
      ],
    });
    return post;
  }

  async create(currentUser, { caption, imageUrl, categoryId }) {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new AppError(
        "Category not found",
        404,
        "categoryId does not exist",
      );
    }

    return Post.create({
      caption,
      imageUrl,
      categoryId,
      userId: currentUser.id,
    });
  }

  // Update: hanya owner (Task 4)
  async update(postId, currentUser, payload) {
    const post = await this._getOwnedPost(postId, currentUser, {
      allowAdmin: false,
    });
    await post.update({
      ...(payload.caption !== undefined && { caption: payload.caption }),
      ...(payload.imageUrl !== undefined && { imageUrl: payload.imageUrl }),
      ...(payload.categoryId !== undefined && {
        categoryId: payload.categoryId,
      }),
    });
    return post;
  }

  // Delete: owner ATAU admin (Task 4 - bonus admin)
  async delete(postId, currentUser) {
    const post = await this._getOwnedPost(postId, currentUser, {
      allowAdmin: true,
    });
    await post.destroy();
    return true;
  }

  async _getPostOr404(id, options = {}) {
    const post = await Post.findByPk(id, options);
    if (!post) {
      throw new AppError("Post not found", 404);
    }
    return post;
  }

  async _getOwnedPost(postId, currentUser, { allowAdmin }) {
    const post = await this._getPostOr404(postId);
    const isOwner = post.userId === currentUser.id;
    const isAdmin = allowAdmin && currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new AppError(
        "You are not allowed to modify this post",
        403,
        "Forbidden: not the owner",
      );
    }

    return post;
  }
}

module.exports = new PostService();
