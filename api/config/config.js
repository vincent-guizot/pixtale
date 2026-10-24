require('dotenv').config();

/**
 * Config untuk Sequelize & Sequelize-CLI.
 * Mendukung PostgreSQL lokal (tanpa SSL) maupun remote/cloud (seperti Neon dengan SSL).
 * SSL hanya diaktifkan jika DATABASE_SSL=true atau terdapat sslmode=require pada URL.
 */
const dbUrl =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'pixtale'}`;

const isSslRequired =
  process.env.DATABASE_SSL === 'true' ||
  (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=require'));

const baseConfig = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  dialectOptions: isSslRequired
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  logging: false,
};

module.exports = {
  development: baseConfig,
  test: baseConfig,
  production: {
    ...baseConfig,
    dialectOptions: isSslRequired
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  },
};
