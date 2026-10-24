/**
 * Helper class untuk menyeragamkan format response sesuai Task 6.
 */
class ApiResponse {
  static success(res, { message = 'Operation successful', data = {}, statusCode = 200 } = {}) {
    return res.status(statusCode).json({ status: 'success', message, data });
  }

  static error(res, { message = 'Something went wrong', details = null, statusCode = 500 } = {}) {
    return res.status(statusCode).json({ status: 'error', message, details });
  }
}

module.exports = ApiResponse;
