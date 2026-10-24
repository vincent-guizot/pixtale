const commentService = require('../services/CommentService');
const ApiResponse = require('../utils/ApiResponse');

class CommentController {
  create = async (req, res, next) => {
    try {
      const { postId, message } = req.body;

      if (!postId || !message) {
        return ApiResponse.error(res, {
          message: 'Validation error',
          details: 'postId and message are required',
          statusCode: 400,
        });
      }

      const comment = await commentService.create(req.user, { postId, message });
      return ApiResponse.success(res, {
        message: 'Comment created successfully',
        data: comment,
        statusCode: 201,
      });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      await commentService.delete(req.params.id, req.user);
      return ApiResponse.success(res, { message: 'Comment deleted successfully', data: {} });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new CommentController();
