require('dotenv').config();
const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected (Neon PostgreSQL)');
    console.log('ℹ️  Schema dikelola lewat migration (npm run migrate), bukan sync().');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('❌ Unable to start server:', err);
    process.exit(1);
  }
}

start();
