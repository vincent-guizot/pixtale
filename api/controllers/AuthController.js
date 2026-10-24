const authService = require('../services/AuthService');
const ApiResponse = require('../utils/ApiResponse');

class AuthController {
  register = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return ApiResponse.error(res, {
          message: 'Validation error',
          details: 'username, email, and password are required',
          statusCode: 400,
        });
      }

      const user = await authService.register({ username, email, password });

      return ApiResponse.success(res, {
        message: 'User registered successfully',
        data: user,
        statusCode: 201,
      });
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return ApiResponse.error(res, {
          message: 'Validation error',
          details: 'email and password are required',
          statusCode: 400,
        });
      }

      const { access_token, user } = await authService.login({ email, password });

      return ApiResponse.success(res, {
        message: 'Login successful',
        data: { access_token, user },
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new AuthController();
