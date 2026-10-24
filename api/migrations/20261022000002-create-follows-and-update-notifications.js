'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Buat tabel Follows
    await queryInterface.createTable('Follows', {
      followerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      followingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // 2. Index untuk mempercepat query followers & following
    await queryInterface.addIndex('Follows', ['followingId']);
    await queryInterface.addIndex('Follows', ['followerId']);

    // 3. Ubah kolom postId di Notifications menjadi nullable untuk tipe notifikasi 'follow'
    await queryInterface.changeColumn('Notifications', 'postId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Posts', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Follows');
    await queryInterface.changeColumn('Notifications', 'postId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Posts', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
