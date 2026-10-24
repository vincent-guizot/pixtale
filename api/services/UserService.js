const { User, Profile, Post, Follow } = require('../models');
const AppError = require('../utils/AppError');

class UserService {
  async findByUsername(username, currentUserId = null) {
    if (!username || !username.trim()) {
      throw new AppError('Username is required', 400);
    }

    const cleanUsername = username.trim();
    const user = await User.findOne({
      where: {
        username: cleanUsername,
      },
      attributes: ['id', 'username', 'createdAt'],
      include: [
        {
          model: Profile,
          attributes: ['id', 'fullName', 'bio', 'avatarUrl'],
        },
      ],
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const postsCount = await Post.count({
      where: {
        userId: user.id,
      },
    });

    const followersCount = await Follow.count({
      where: {
        followingId: user.id,
      },
    });

    const followingCount = await Follow.count({
      where: {
        followerId: user.id,
      },
    });

    let isFollowing = false;
    if (currentUserId) {
      const cleanCurrentUserId = parseInt(currentUserId, 10);
      const followRecord = await Follow.findOne({
        where: {
          followerId: cleanCurrentUserId,
          followingId: user.id,
        },
      });
      isFollowing = Boolean(followRecord);
    }

    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      Profile: user.Profile,
      postsCount: postsCount,
      followersCount: followersCount,
      followingCount: followingCount,
      isFollowing: isFollowing,
    };
  }
}

module.exports = new UserService();
