const ApiResponse = require('../utils/ApiResponse');

/**
 * Error handler terpusat. Menangkap AppError, SequelizeValidationError,
 * dan unhandled error lainnya dengan format konsisten (Task 6).
 */
module.exports = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  // Penanganan error validasi bawaan Sequelize
  if (err.name === 'SequelizeValidationError') {
    const details = err.errors ? err.errors.map((e) => e.message).join(', ') : err.message;
    return ApiResponse.error(res, {
      message: 'Validation error',
      details,
      statusCode: 400,
    });
  }

  // Penanganan error duplikasi unique constraint bawaan Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    const details = err.errors
      ? err.errors.map((e) => `${e.path} already exists`).join(', ')
      : 'Duplicate value violates unique constraint';
    return ApiResponse.error(res, {
      message: 'Conflict',
      details,
      statusCode: 409,
    });
  }

  // Penanganan error JWT jika lolos ke handler umum
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, {
      message: 'Unauthorized',
      details: 'Invalid or expired token',
      statusCode: 401,
    });
  }

  // AppError buatan sendiri
  if (err.statusCode) {
    return ApiResponse.error(res, {
      message: err.message,
      details: err.details || null,
      statusCode: err.statusCode,
    });
  }

  // Error sistem 500 - sembunyikan detail teknis database/stack di production
  const isProd = process.env.NODE_ENV === 'production';
  return ApiResponse.error(res, {
    message: 'Internal server error',
    details: isProd ? null : err.message,
    statusCode: 500,
  });
};
