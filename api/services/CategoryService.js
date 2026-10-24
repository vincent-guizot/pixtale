const { Category } = require('../models');
const AppError = require('../utils/AppError');

class CategoryService {
  async findAll() {
    return Category.findAll({ order: [['name', 'ASC']] });
  }

  async findById(id) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }

  async create({ name, description }) {
    return Category.create({ name, description });
  }
}

module.exports = new CategoryService();
