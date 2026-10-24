const { Router } = require('express');
const upload = require('../middlewares/upload');
const authenticate = require('../middlewares/authenticate');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

const router = Router();

router.post('/', authenticate, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('File size exceeds the 5MB limit', 400));
      }
      return next(err);
    }

    if (!req.file) {
      return ApiResponse.error(res, {
        message: 'Validation error',
        details: 'No image file uploaded',
        statusCode: 400,
      });
    }

    const fileUrl = `/files/${req.file.filename}`;
    return ApiResponse.success(res, {
      message: 'File uploaded successfully',
      data: {
        fileUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
      statusCode: 201,
    });
  });
});

module.exports = router;
