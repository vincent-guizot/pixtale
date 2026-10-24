"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const hashedPassword = await bcrypt.hash("123", 10);

    await queryInterface.bulkInsert("Users", [
      {
        username: "admin",
        email: "admin@codigram.com",
        password: hashedPassword,
        role: "admin",
        createdAt: now,
        updatedAt: now,
      },
      {
        username: "jane",
        email: "jane@codigram.com",
        password: hashedPassword,
        role: "user",
        createdAt: now,
        updatedAt: now,
      },
      {
        username: "john",
        email: "john@codigram.com",
        password: hashedPassword,
        role: "user",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const users = await queryInterface.sequelize.query(
      `SELECT id, username FROM "Users" WHERE email IN ('admin@codigram.com', 'jane@codigram.com', 'john@codigram.com');`,
      { type: Sequelize.QueryTypes.SELECT },
    );
    const idOf = (username) => users.find((u) => u.username === username).id;

    await queryInterface.bulkInsert("Profiles", [
      {
        fullName: "Admin Codigram",
        userId: idOf("admin"),
        createdAt: now,
        updatedAt: now,
      },
      {
        fullName: "Jane Doe",
        userId: idOf("jane"),
        createdAt: now,
        updatedAt: now,
      },
      {
        fullName: "John Smith",
        userId: idOf("john"),
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Profiles", null, {});
    await queryInterface.bulkDelete(
      "Users",
      {
        email: ["admin@codigram.com", "jane@codigram.com", "john@codigram.com"],
      },
      {},
    );
  },
};
