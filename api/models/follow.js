'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    static associate(models) {
      Follow.belongsTo(models.User, { as: 'follower', foreignKey: 'followerId' });
      Follow.belongsTo(models.User, { as: 'following', foreignKey: 'followingId' });
    }
  }

  Follow.init(
    {
      followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Follow',
      tableName: 'Follows',
      timestamps: true,
    }
  );

  return Follow;
};
