const JwtUtil = require('../utils/JwtUtil');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Memverifikasi Bearer token JWT, lalu menaruh payload
 * ({ id, role }) ke req.user agar bisa dipakai controller/service (Task 3).
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponse.error(res, {
      message: 'Unauthorized',
      details: 'No token provided',
      statusCode: 401,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = JwtUtil.verify(token);
    req.user = decoded;
    next();
  } catch (err) {
    return ApiResponse.error(res, {
      message: 'Unauthorized',
      details: 'Invalid or expired token',
      statusCode: 401,
    });
  }
};
