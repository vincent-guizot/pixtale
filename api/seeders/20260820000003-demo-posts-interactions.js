'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const users = await queryInterface.sequelize.query(`SELECT id, username FROM "Users";`, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const categories = await queryInterface.sequelize.query(`SELECT id, name FROM "Categories";`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    const userId = (username) => users.find((u) => u.username === username).id;
    const categoryId = (name) => categories.find((c) => c.name === name).id;

    await queryInterface.bulkInsert('Posts', [
      {
        caption: 'Liburan ke Bali 🏝️',
        imageUrl: 'https://picsum.photos/seed/bali/600',
        userId: userId('jane'),
        categoryId: categoryId('Travel'),
        createdAt: now,
        updatedAt: now,
      },
      {
        caption: 'Kopi pagi ini enak banget ☕',
        imageUrl: 'https://picsum.photos/seed/coffee/600',
        userId: userId('john'),
        categoryId: categoryId('Food'),
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const posts = await queryInterface.sequelize.query(`SELECT id, caption FROM "Posts";`, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const baliPostId = posts.find((p) => p.caption === 'Liburan ke Bali 🏝️').id;

    // Comment & like dari John ke post Jane -> otomatis memicu Notification (lihat services/NotificationService.js)
    await queryInterface.bulkInsert('Comments', [
      { message: 'Keren banget!', postId: baliPostId, userId: userId('john'), createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('Likes', [
      { userId: userId('john'), postId: baliPostId, createdAt: now, updatedAt: now },
      { userId: userId('admin'), postId: baliPostId, createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('Notifications', [
      {
        type: 'comment',
        message: 'john mengomentari post kamu',
        isRead: false,
        recipientId: userId('jane'),
        actorId: userId('john'),
        postId: baliPostId,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: 'like',
        message: 'john menyukai post kamu',
        isRead: false,
        recipientId: userId('jane'),
        actorId: userId('john'),
        postId: baliPostId,
        createdAt: now,
        updatedAt: now,
      },
      {
        type: 'like',
        message: 'admin menyukai post kamu',
        isRead: false,
        recipientId: userId('jane'),
        actorId: userId('admin'),
        postId: baliPostId,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Notifications', null, {});
    await queryInterface.bulkDelete('Likes', null, {});
    await queryInterface.bulkDelete('Comments', null, {});
    await queryInterface.bulkDelete('Posts', null, {});
  },
};
