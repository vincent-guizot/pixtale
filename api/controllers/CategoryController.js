const categoryService = require('../services/CategoryService');
const ApiResponse = require('../utils/ApiResponse');

class CategoryController {
  getAll = async (req, res, next) => {
    try {
      const categories = await categoryService.findAll();
      return ApiResponse.success(res, { message: 'Categories fetched successfully', data: categories });
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const { name, description } = req.body;
      if (!name) {
        return ApiResponse.error(res, {
          message: 'Validation error',
          details: 'name is required',
          statusCode: 400,
        });
      }
      const category = await categoryService.create({ name, description });
      return ApiResponse.success(res, {
        message: 'Category created successfully',
        data: category,
        statusCode: 201,
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new CategoryController();
