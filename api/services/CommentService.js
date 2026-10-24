const { Comment, Post, User } = require('../models');
const AppError = require('../utils/AppError');
const notificationService = require('./NotificationService');

class CommentService {
  async create(currentUser, { postId, message }) {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new AppError('Post not found', 404, 'postId does not exist');
    }

    const comment = await Comment.create({
      message,
      postId,
      userId: currentUser.id,
    });

    // Beri tahu pemilik post kalau post-nya dikomentari orang lain
    await notificationService.notify({ type: 'comment', actor: currentUser, post });

    return Comment.findByPk(comment.id, {
      include: [{ model: User, attributes: ['id', 'username'] }],
    });
  }

  // Delete: hanya owner comment (Task 4)
  async delete(commentId, currentUser) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.userId !== currentUser.id) {
      throw new AppError('You are not allowed to delete this comment', 403, 'Forbidden: not the owner');
    }

    await comment.destroy();
    return true;
  }
}

module.exports = new CommentService();
