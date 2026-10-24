const { Notification, User, Post } = require('../models');
const AppError = require('../utils/AppError');

class NotificationService {
  /**
   * Dipanggil secara internal oleh LikeService/CommentService.
   * Tidak membuat notifikasi kalau actor === recipient (like/comment post sendiri).
   */
  async notify({ type, actor, post }) {
    if (post.userId === actor.id) return null;

    // req.user (dari JWT) cuma berisi { id, role }, jadi ambil username asli dari DB
    const actorUser = await User.findByPk(actor.id, { attributes: ['id', 'username'] });
    const actorName = actorUser ? actorUser.username : 'Someone';

    const message =
      type === 'like'
        ? `${actorName} menyukai post kamu`
        : `${actorName} mengomentari post kamu`;

    return Notification.create({
      type,
      message,
      recipientId: post.userId,
      actorId: actor.id,
      postId: post.id,
    });
  }

  async findAllForUser(userId) {
    return Notification.findAll({
      where: { recipientId: userId },
      include: [
        { model: User, as: 'actor', attributes: ['id', 'username'], required: false },
        { model: Post, attributes: ['id', 'caption'], required: false },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async markAsRead(notificationId, currentUser) {
    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }
    if (notification.recipientId !== currentUser.id) {
      throw new AppError('You are not allowed to access this notification', 403);
    }
    await notification.update({ isRead: true });
    return notification;
  }

  async markAllAsRead(currentUser) {
    await Notification.update(
      { isRead: true },
      { where: { recipientId: currentUser.id, isRead: false } }
    );
    return true;
  }
}

module.exports = new NotificationService();
