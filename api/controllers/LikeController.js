const likeService = require('../services/LikeService');
const ApiResponse = require('../utils/ApiResponse');

class LikeController {
  like = async (req, res, next) => {
    try {
      const like = await likeService.like(req.user, req.params.postId);
      return ApiResponse.success(res, {
        message: 'Post liked successfully',
        data: like,
        statusCode: 201,
      });
    } catch (err) {
      next(err);
    }
  };

  unlike = async (req, res, next) => {
    try {
      await likeService.unlike(req.user, req.params.postId);
      return ApiResponse.success(res, { message: 'Post unliked successfully', data: {} });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new LikeController();
