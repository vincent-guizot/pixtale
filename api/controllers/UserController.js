const userService = require('../services/UserService');
const followService = require('../services/FollowService');
const ApiResponse = require('../utils/ApiResponse');

class UserController {
  getByUsername = async (req, res, next) => {
    try {
      const username = req.params.username;
      const currentUserId = req.user ? req.user.id : null;
      const user = await userService.findByUsername(username, currentUserId);

      return ApiResponse.success(res, {
        message: 'User profile fetched successfully',
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };

  toggleFollow = async (req, res, next) => {
    try {
      const targetUserId = req.params.id;
      const currentUserId = req.user.id;
      const result = await followService.toggleFollow(currentUserId, targetUserId);

      return ApiResponse.success(res, {
        message: result.message,
        data: {
          isFollowing: result.isFollowing,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  getFollowers = async (req, res, next) => {
    try {
      const targetUserId = req.params.id;
      const currentUserId = req.user ? req.user.id : null;
      const followers = await followService.getFollowers(targetUserId, currentUserId);

      return ApiResponse.success(res, {
        message: 'Followers fetched successfully',
        data: followers,
      });
    } catch (err) {
      next(err);
    }
  };

  getFollowing = async (req, res, next) => {
    try {
      const targetUserId = req.params.id;
      const currentUserId = req.user ? req.user.id : null;
      const following = await followService.getFollowing(targetUserId, currentUserId);

      return ApiResponse.success(res, {
        message: 'Following fetched successfully',
        data: following,
      });
    } catch (err) {
      next(err);
    }
  };

  getSuggestions = async (req, res, next) => {
    try {
      const currentUserId = req.user ? req.user.id : null;
      const limit = req.query.limit || 5;
      const suggestions = await followService.getSuggestions(currentUserId, limit);

      return ApiResponse.success(res, {
        message: 'Suggestions fetched successfully',
        data: suggestions,
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new UserController();
