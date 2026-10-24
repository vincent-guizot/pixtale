require('dotenv').config();

/**
 * Config untuk sequelize-cli (migrate & seed) sekaligus dipakai
 * models/index.js untuk membuat koneksi Sequelize ke Neon PostgreSQL.
 * Semua environment memakai DATABASE_URL dari .env karena Neon
 * sudah menyediakan satu connection string per branch/project.
 */
const baseConfig = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
};

module.exports = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig,
};
