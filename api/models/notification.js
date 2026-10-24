'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // User yang MENERIMA notifikasi (pemilik post)
      Notification.belongsTo(models.User, { as: 'recipient', foreignKey: 'recipientId' });
      // User yang MEMICU notifikasi (yang like/comment)
      Notification.belongsTo(models.User, { as: 'actor', foreignKey: 'actorId' });
      Notification.belongsTo(models.Post, { foreignKey: 'postId' });
    }
  }

  Notification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        // 'like' | 'comment' | 'follow'
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      recipientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      actorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Posts', key: 'id' },
      },
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'Notifications',
      timestamps: true,
    }
  );

  return Notification;
};
