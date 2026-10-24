const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const db = require('../models');
const { User, Profile, sequelize } = db;
const JwtUtil = require('../utils/JwtUtil');
const AppError = require('../utils/AppError');

const SALT_ROUNDS = 10;

class AuthService {
  async register({ username, email, password }) {
    const existing = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (existing) {
      throw new AppError('Username or email is already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return await sequelize.transaction(async (t) => {
      const user = await User.create(
        { username, email, password: hashedPassword },
        { transaction: t }
      );

      // Setiap user otomatis punya profile kosong (relasi 1-1)
      await Profile.create({ userId: user.id }, { transaction: t });

      return user;
    });
  }

  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const access_token = JwtUtil.sign({ id: user.id, role: user.role });

    return { access_token, user };
  }
}

module.exports = new AuthService();
