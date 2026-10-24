const ApiResponse = require('../utils/ApiResponse');

/**
 * Middleware opsional untuk route yang hanya boleh diakses admin.
 * Ownership check untuk post/comment/profile dilakukan langsung di service.
 */
module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return ApiResponse.error(res, {
      message: 'Forbidden',
      details: 'Admin access required',
      statusCode: 403,
    });
  }
  next();
};
