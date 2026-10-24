const notificationService = require('../services/NotificationService');
const ApiResponse = require('../utils/ApiResponse');

class NotificationController {
  getAll = async (req, res, next) => {
    try {
      const notifications = await notificationService.findAllForUser(req.user.id);
      return ApiResponse.success(res, {
        message: 'Notifications fetched successfully',
        data: notifications,
      });
    } catch (err) {
      next(err);
    }
  };

  markAsRead = async (req, res, next) => {
    try {
      const notification = await notificationService.markAsRead(req.params.id, req.user);
      return ApiResponse.success(res, {
        message: 'Notification marked as read',
        data: notification,
      });
    } catch (err) {
      next(err);
    }
  };

  markAllAsRead = async (req, res, next) => {
    try {
      await notificationService.markAllAsRead(req.user);
      return ApiResponse.success(res, {
        message: 'All notifications marked as read',
        data: {},
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new NotificationController();
