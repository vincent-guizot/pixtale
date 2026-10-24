const profileService = require('../services/ProfileService');
const ApiResponse = require('../utils/ApiResponse');

class ProfileController {
  getMyProfile = async (req, res, next) => {
    try {
      const profile = await profileService.findByUserId(req.user.id);
      return ApiResponse.success(res, { message: 'Profile fetched successfully', data: profile });
    } catch (err) {
      next(err);
    }
  };

  updateMyProfile = async (req, res, next) => {
    try {
      const { fullName, bio, avatarUrl } = req.body;
      const profile = await profileService.updateOwnProfile(req.user, { fullName, bio, avatarUrl });
      return ApiResponse.success(res, { message: 'Profile updated successfully', data: profile });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new ProfileController();
