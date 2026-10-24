const { Profile, User } = require('../models');
const AppError = require('../utils/AppError');

class ProfileService {
  async findByUserId(userId) {
    const profile = await Profile.findOne({
      where: { userId },
      include: [{ model: User, attributes: ['id', 'username', 'email'] }],
    });

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    return profile;
  }

  // Ownership sudah pasti terjamin karena kita selalu update berdasarkan
  // currentUser.id, bukan id yang dikirim dari client (Task 4).
  async updateOwnProfile(currentUser, { fullName, bio, avatarUrl }) {
    const [profile] = await Profile.findOrCreate({
      where: { userId: currentUser.id },
      defaults: { userId: currentUser.id },
    });

    await profile.update({
      ...(fullName !== undefined && { fullName }),
      ...(bio !== undefined && { bio }),
      ...(avatarUrl !== undefined && { avatarUrl }),
    });

    return profile;
  }
}

module.exports = new ProfileService();
