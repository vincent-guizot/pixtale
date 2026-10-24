/**
 * Custom error class agar service bisa "melempar" error dengan statusCode
 * yang jelas, lalu ditangkap oleh middlewares/errorHandler.js.
 */
class AppError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details || message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
