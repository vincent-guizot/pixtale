'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('Categories', [
      { name: 'Travel', description: 'Kategori Travel', createdAt: now, updatedAt: now },
      { name: 'Food', description: 'Kategori Food', createdAt: now, updatedAt: now },
      { name: 'Photography', description: 'Kategori Photography', createdAt: now, updatedAt: now },
      { name: 'Lifestyle', description: 'Kategori Lifestyle', createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'Categories',
      { name: ['Travel', 'Food', 'Photography', 'Lifestyle'] },
      {}
    );
  },
};
