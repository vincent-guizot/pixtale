'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: 'userId' });
      Like.belongsTo(models.Post, { foreignKey: 'postId' });
    }
  }

  // Junction table untuk relasi M-N User <-> Post.
  // Primary key gabungan (userId, postId) - lihat catatan perbaikan di README.
  Like.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'Users', key: 'id' },
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'Posts', key: 'id' },
      },
    },
    {
      sequelize,
      modelName: 'Like',
      tableName: 'Likes',
      timestamps: true,
    }
  );

  return Like;
};
