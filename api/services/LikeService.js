const { Like, Post } = require('../models');
const AppError = require('../utils/AppError');
const notificationService = require('./NotificationService');

class LikeService {
  async like(currentUser, postId) {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const [like, created] = await Like.findOrCreate({
      where: { userId: currentUser.id, postId },
    });

    if (!created) {
      throw new AppError('You already liked this post', 409);
    }

    // Beri tahu pemilik post kalau post-nya di-like orang lain
    await notificationService.notify({ type: 'like', actor: currentUser, post });

    return like;
  }

  async unlike(currentUser, postId) {
    const like = await Like.findOne({
      where: { userId: currentUser.id, postId },
    });

    if (!like) {
      throw new AppError('Like not found', 404, 'You have not liked this post yet');
    }

    await like.destroy();
    return true;
  }
}

module.exports = new LikeService();
