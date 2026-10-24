'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: 'userId' });
      Post.belongsTo(models.Category, { foreignKey: 'categoryId' });
      Post.hasMany(models.Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
      Post.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'postId',
        otherKey: 'userId',
        as: 'likedBy',
      });
    }
  }

  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      caption: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Categories', key: 'id' },
      },
    },
    {
      sequelize,
      modelName: 'Post',
      tableName: 'Posts',
      timestamps: true,
    }
  );

  return Post;
};
