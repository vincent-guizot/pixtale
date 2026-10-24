'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.hasMany(models.Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.hasMany(models.Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.belongsToMany(models.Post, {
        through: models.Like,
        foreignKey: 'userId',
        otherKey: 'postId',
        as: 'likedPosts',
      });
      // Notifikasi yang DITERIMA user ini (mis. post-nya di-like/comment orang lain)
      User.hasMany(models.Notification, {
        as: 'notifications',
        foreignKey: 'recipientId',
        onDelete: 'CASCADE',
      });
      // Notifikasi yang DIPICU oleh user ini (dia yang like/comment)
      User.hasMany(models.Notification, {
        as: 'triggeredNotifications',
        foreignKey: 'actorId',
        onDelete: 'CASCADE',
      });
      // Relasi Follows
      User.hasMany(models.Follow, {
        as: 'followingRelations',
        foreignKey: 'followerId',
        onDelete: 'CASCADE',
      });
      User.hasMany(models.Follow, {
        as: 'followerRelations',
        foreignKey: 'followingId',
        onDelete: 'CASCADE',
      });
      User.belongsToMany(models.User, {
        through: models.Follow,
        as: 'following',
        foreignKey: 'followerId',
        otherKey: 'followingId',
      });
      User.belongsToMany(models.User, {
        through: models.Follow,
        as: 'followers',
        foreignKey: 'followingId',
        otherKey: 'followerId',
      });
    }

    // Pastikan password tidak pernah ikut ter-serialize ke response
    toJSON() {
      const values = { ...this.get() };
      delete values.password;
      return values;
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: { notEmpty: true },
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'user',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
    }
  );

  return User;
};
