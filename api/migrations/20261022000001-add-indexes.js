'use strict';

/**
 * Migrasi penambahan secondary indexes pada foreign keys dan kolom query
 * yang sering difilter atau diurutkan (Fase 3 - Optimasi Kinerja Basis Data).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Indexes pada tabel Posts
    await queryInterface.addIndex('Posts', ['userId'], { name: 'posts_user_id_idx' });
    await queryInterface.addIndex('Posts', ['categoryId'], { name: 'posts_category_id_idx' });
    await queryInterface.addIndex('Posts', ['createdAt'], { name: 'posts_created_at_idx' });

    // Indexes pada tabel Comments
    await queryInterface.addIndex('Comments', ['postId'], { name: 'comments_post_id_idx' });
    await queryInterface.addIndex('Comments', ['userId'], { name: 'comments_user_id_idx' });

    // Index pada tabel Likes (mendukung reverse lookup & subquery COUNT(*) berdasarkan postId)
    await queryInterface.addIndex('Likes', ['postId'], { name: 'likes_post_id_idx' });

    // Indexes pada tabel Notifications
    await queryInterface.addIndex('Notifications', ['recipientId', 'isRead'], {
      name: 'notifications_recipient_is_read_idx',
    });
    await queryInterface.addIndex('Notifications', ['actorId'], { name: 'notifications_actor_id_idx' });
    await queryInterface.addIndex('Notifications', ['postId'], { name: 'notifications_post_id_idx' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Posts', 'posts_user_id_idx');
    await queryInterface.removeIndex('Posts', 'posts_category_id_idx');
    await queryInterface.removeIndex('Posts', 'posts_created_at_idx');

    await queryInterface.removeIndex('Comments', 'comments_post_id_idx');
    await queryInterface.removeIndex('Comments', 'comments_user_id_idx');

    await queryInterface.removeIndex('Likes', 'likes_post_id_idx');

    await queryInterface.removeIndex('Notifications', 'notifications_recipient_is_read_idx');
    await queryInterface.removeIndex('Notifications', 'notifications_actor_id_idx');
    await queryInterface.removeIndex('Notifications', 'notifications_post_id_idx');
  },
};
