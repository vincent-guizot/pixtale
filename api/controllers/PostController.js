const postService = require('../services/PostService');
const ApiResponse = require('../utils/ApiResponse');

class PostController {
  getAll = async (req, res, next) => {
    try {
      const { categoryId, userId, search, page, limit, feed } = req.query;
      const currentUserId = req.user ? req.user.id : null;
      const posts = await postService.findAll({
        categoryId,
        userId,
        search,
        page,
        limit,
        currentUserId,
        feed,
      });
      return ApiResponse.success(res, { message: 'Posts fetched successfully', data: posts });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const currentUserId = req.user ? req.user.id : null;
      const post = await postService.findById(req.params.id, currentUserId);
      return ApiResponse.success(res, { message: 'Post fetched successfully', data: post });
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const { caption, imageUrl, categoryId } = req.body;

      if (!categoryId) {
        return ApiResponse.error(res, {
          message: 'Validation error',
          details: 'categoryId is required',
          statusCode: 400,
        });
      }

      const post = await postService.create(req.user, { caption, imageUrl, categoryId });
      return ApiResponse.success(res, {
        message: 'Post created successfully',
        data: post,
        statusCode: 201,
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const post = await postService.update(req.params.id, req.user, req.body);
      return ApiResponse.success(res, { message: 'Post updated successfully', data: post });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      await postService.delete(req.params.id, req.user);
      return ApiResponse.success(res, { message: 'Post deleted successfully', data: {} });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new PostController();
