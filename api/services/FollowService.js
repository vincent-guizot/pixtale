const { Op } = require('sequelize');
const db = require('../models');
const { Follow, User, Profile, Notification, Post } = db;
const AppError = require('../utils/AppError');

class FollowService {
  async toggleFollow(followerUserId, targetUserId) {
    const followerId = parseInt(followerUserId, 10);
    const followingId = parseInt(targetUserId, 10);

    if (isNaN(followerId) || isNaN(followingId)) {
      throw new AppError('Invalid user ID provided', 400);
    }

    if (followerId === followingId) {
      throw new AppError('You cannot follow yourself', 400);
    }

    const targetUser = await User.findByPk(followingId);
    if (!targetUser) {
      throw new AppError('Target user not found', 404);
    }

    const existingFollow = await Follow.findOne({
      where: {
        followerId: followerId,
        followingId: followingId,
      },
    });

    if (existingFollow) {
      await existingFollow.destroy();
      return {
        isFollowing: false,
        message: `Unfollowed @${targetUser.username}`,
      };
    }

    await Follow.create({
      followerId: followerId,
      followingId: followingId,
    });

    // Buat notifikasi follow ke target user (hindari spam jika belum dibaca)
    try {
      const existingNotification = await Notification.findOne({
        where: {
          type: 'follow',
          recipientId: followingId,
          actorId: followerId,
          isRead: false,
        },
      });

      if (!existingNotification) {
        await Notification.create({
          type: 'follow',
          message: 'started following you.',
          recipientId: followingId,
          actorId: followerId,
          postId: null,
        });
      }
    } catch (notificationError) {
      // Jangan gagalkan aksi follow jika notifikasi gagal
      console.error('Failed to create follow notification:', notificationError.message);
    }

    return {
      isFollowing: true,
      message: `Following @${targetUser.username}`,
    };
  }

  async getFollowers(targetUserId, currentUserId) {
    const userId = parseInt(targetUserId, 10);
    if (isNaN(userId)) {
      throw new AppError('Invalid user ID provided', 400);
    }

    const targetUser = await User.findByPk(userId);
    if (!targetUser) {
      throw new AppError('User not found', 404);
    }

    const follows = await Follow.findAll({
      where: { followingId: userId },
      include: [
        {
          model: User,
          as: 'follower',
          attributes: ['id', 'username'],
          include: [
            {
              model: Profile,
              attributes: ['fullName', 'avatarUrl', 'bio'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Dapatkan daftar id yang di-follow oleh user yang sedang login
    let myFollowingIds = new Set();
    if (currentUserId) {
      const myFollows = await Follow.findAll({
        where: { followerId: parseInt(currentUserId, 10) },
        attributes: ['followingId'],
      });
      myFollowingIds = new Set(myFollows.map((f) => f.followingId));
    }

    return follows.map((followRecord) => {
      const user = followRecord.follower;
      return {
        id: user.id,
        username: user.username,
        Profile: user.Profile,
        isFollowing: currentUserId ? myFollowingIds.has(user.id) : false,
        followedAt: followRecord.createdAt,
      };
    });
  }

  async getFollowing(targetUserId, currentUserId) {
    const userId = parseInt(targetUserId, 10);
    if (isNaN(userId)) {
      throw new AppError('Invalid user ID provided', 400);
    }

    const targetUser = await User.findByPk(userId);
    if (!targetUser) {
      throw new AppError('User not found', 404);
    }

    const follows = await Follow.findAll({
      where: { followerId: userId },
      include: [
        {
          model: User,
          as: 'following',
          attributes: ['id', 'username'],
          include: [
            {
              model: Profile,
              attributes: ['fullName', 'avatarUrl', 'bio'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    let myFollowingIds = new Set();
    if (currentUserId) {
      const myFollows = await Follow.findAll({
        where: { followerId: parseInt(currentUserId, 10) },
        attributes: ['followingId'],
      });
      myFollowingIds = new Set(myFollows.map((f) => f.followingId));
    }

    return follows.map((followRecord) => {
      const user = followRecord.following;
      return {
        id: user.id,
        username: user.username,
        Profile: user.Profile,
        isFollowing: currentUserId ? myFollowingIds.has(user.id) : false,
        followedAt: followRecord.createdAt,
      };
    });
  }

  async getSuggestions(currentUserId, limit = 5) {
    const parsedLimit = parseInt(limit, 10) || 5;
    let excludedUserIds = [];

    if (currentUserId) {
      const cleanCurrentUserId = parseInt(currentUserId, 10);
      excludedUserIds.push(cleanCurrentUserId);

      const existingFollows = await Follow.findAll({
        where: { followerId: cleanCurrentUserId },
        attributes: ['followingId'],
      });
      existingFollows.forEach((item) => {
        excludedUserIds.push(item.followingId);
      });
    }

    const users = await User.findAll({
      where: {
        id: {
          [Op.notIn]: excludedUserIds,
        },
      },
      attributes: ['id', 'username'],
      include: [
        {
          model: Profile,
          attributes: ['fullName', 'avatarUrl', 'bio'],
        },
      ],
      limit: parsedLimit,
      order: [['createdAt', 'DESC']],
    });

    return users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        Profile: user.Profile,
        isFollowing: false,
      };
    });
  }
}

module.exports = new FollowService();
