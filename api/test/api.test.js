const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');
const JwtUtil = require('../utils/JwtUtil');
const errorHandler = require('../middlewares/errorHandler');
const authenticate = require('../middlewares/authenticate');
const authorizeAdmin = require('../middlewares/authorizeAdmin');
const optionalAuth = require('../middlewares/optionalAuth');
const upload = require('../middlewares/upload');

// Helper mock response object
function createMockRes() {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  return res;
}

describe('ApiResponse Helper Tests', () => {
  it('should format success response correctly with default status 200', () => {
    const res = createMockRes();
    ApiResponse.success(res, { message: 'Operasi sukses', data: { id: 1, name: 'PixTale' } });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, {
      status: 'success',
      message: 'Operasi sukses',
      data: { id: 1, name: 'PixTale' },
    });
  });

  it('should format custom status code for success (201 Created)', () => {
    const res = createMockRes();
    ApiResponse.success(res, { message: 'Created', data: { id: 2 }, statusCode: 201 });
    assert.equal(res.statusCode, 201);
    assert.equal(res.body.status, 'success');
    assert.equal(res.body.message, 'Created');
  });

  it('should format error response correctly with status 404', () => {
    const res = createMockRes();
    ApiResponse.error(res, { message: 'Not found', details: 'Post not found', statusCode: 404 });
    assert.equal(res.statusCode, 404);
    assert.deepEqual(res.body, {
      status: 'error',
      message: 'Not found',
      details: 'Post not found',
    });
  });

  it('should format default 500 error response', () => {
    const res = createMockRes();
    ApiResponse.error(res, { message: 'Internal Server Error' });
    assert.equal(res.statusCode, 500);
    assert.equal(res.body.status, 'error');
  });
});

describe('AppError Utility Tests', () => {
  it('should instantiate AppError with message, status code, and optional details', () => {
    const err = new AppError('Forbidden action', 403, 'User not allowed');
    assert.ok(err instanceof Error);
    assert.equal(err.name, 'AppError');
    assert.equal(err.message, 'Forbidden action');
    assert.equal(err.statusCode, 403);
    assert.equal(err.details, 'User not allowed');
  });

  it('should default statusCode to 400 when not provided', () => {
    const err = new AppError('Unexpected error');
    assert.equal(err.statusCode, 400);
    assert.equal(err.details, 'Unexpected error');
  });
});

describe('JwtUtil Tests', () => {
  it('should sign and verify valid payload', () => {
    process.env.JWT_SECRET = 'test-pixtale-secret-key';
    const payload = { id: 123, role: 'admin' };
    const token = JwtUtil.sign(payload);
    assert.ok(token);

    const decoded = JwtUtil.verify(token);
    assert.equal(decoded.id, 123);
    assert.equal(decoded.role, 'admin');
  });

  it('should throw error when verifying tampered or invalid token', () => {
    process.env.JWT_SECRET = 'test-pixtale-secret-key';
    assert.throws(() => {
      JwtUtil.verify('invalid.token.structure');
    });
  });
});

describe('ErrorHandler Middleware Tests', () => {
  it('should map SequelizeValidationError to HTTP 400 with validation message', () => {
    const res = createMockRes();
    const err = {
      name: 'SequelizeValidationError',
      errors: [{ message: 'Validation isEmail on email failed' }],
    };

    errorHandler(err, {}, res, () => {});
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.status, 'error');
    assert.equal(res.body.details, 'Validation isEmail on email failed');
  });

  it('should map SequelizeUniqueConstraintError to HTTP 409', () => {
    const res = createMockRes();
    const err = {
      name: 'SequelizeUniqueConstraintError',
      errors: [{ path: 'email' }],
    };

    errorHandler(err, {}, res, () => {});
    assert.equal(res.statusCode, 409);
    assert.equal(res.body.message, 'Conflict');
    assert.equal(res.body.details, 'email already exists');
  });

  it('should handle AppError instances faithfully', () => {
    const res = createMockRes();
    const err = new AppError('Post not found', 404, 'Post ID 999 not found');

    errorHandler(err, {}, res, () => {});
    assert.equal(res.statusCode, 404);
    assert.equal(res.body.message, 'Post not found');
    assert.equal(res.body.details, 'Post ID 999 not found');
  });

  it('should sanitize 500 error details in production', () => {
    const prevEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const res = createMockRes();
    const err = new Error('Sensitive database credentials leak');
    errorHandler(err, {}, res, () => {});

    assert.equal(res.statusCode, 500);
    assert.equal(res.body.message, 'Internal server error');
    assert.equal(res.body.details, null);

    process.env.NODE_ENV = prevEnv;
  });
});

describe('Authenticate Middleware Tests', () => {
  it('should return 401 when Authorization header is absent', () => {
    const req = { headers: {} };
    const res = createMockRes();
    let nextCalled = false;

    authenticate(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.message, 'Unauthorized');
  });

  it('should return 401 when Authorization header does not start with Bearer', () => {
    const req = { headers: { authorization: 'Basic 123456' } };
    const res = createMockRes();
    let nextCalled = false;

    authenticate(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 401);
  });

  it('should return 401 on malformed or expired token', () => {
    const req = { headers: { authorization: 'Bearer malformed.bad.token' } };
    const res = createMockRes();
    let nextCalled = false;

    authenticate(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.details, 'Invalid or expired token');
  });

  it('should assign decoded payload to req.user and call next() on valid token', () => {
    process.env.JWT_SECRET = 'test-pixtale-secret-key';
    const token = JwtUtil.sign({ id: 10, role: 'user' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createMockRes();
    let nextCalled = false;

    authenticate(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(req.user.id, 10);
    assert.equal(req.user.role, 'user');
  });
});

describe('AuthorizeAdmin Middleware Tests', () => {
  it('should return 403 Forbidden when user is not admin', () => {
    const req = { user: { id: 5, role: 'user' } };
    const res = createMockRes();
    let nextCalled = false;

    authorizeAdmin(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 403);
    assert.equal(res.body.details, 'Admin access required');
  });

  it('should call next() when user has admin role', () => {
    const req = { user: { id: 1, role: 'admin' } };
    const res = createMockRes();
    let nextCalled = false;

    authorizeAdmin(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
  });
});

describe('OptionalAuth Middleware Tests', () => {
  it('should proceed and set req.user to null when no header is present', () => {
    const req = { headers: {} };
    let nextCalled = false;
    optionalAuth(req, {}, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(req.user, null);
  });

  it('should decode valid token into req.user', () => {
    process.env.JWT_SECRET = 'test-pixtale-secret-key';
    const token = JwtUtil.sign({ id: 42, role: 'admin' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    let nextCalled = false;

    optionalAuth(req, {}, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(req.user.id, 42);
    assert.equal(req.user.role, 'admin');
  });

  it('should set req.user to null and gracefully continue when token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalid-token' } };
    let nextCalled = false;

    optionalAuth(req, {}, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(req.user, null);
  });
});

describe('Upload Middleware Filter Tests', () => {
  it('should accept valid image formats (.png, .jpg, .webp)', () => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const allowedExts = /\.(jpe?g|png|webp|gif)$/i;

    const file = { originalname: 'avatar.png', mimetype: 'image/png' };
    const isValid = allowedMimes.includes(file.mimetype) && allowedExts.test(path.extname(file.originalname));
    assert.equal(isValid, true);
  });

  it('should reject non-image file formats (.exe, .pdf, .txt)', () => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const allowedExts = /\.(jpe?g|png|webp|gif)$/i;

    const file = { originalname: 'malicious.exe', mimetype: 'application/x-msdownload' };
    const isValid = allowedMimes.includes(file.mimetype) && allowedExts.test(path.extname(file.originalname));
    assert.equal(isValid, false);
  });
});

describe('UserService Validation Tests', () => {
  const userService = require('../services/UserService');

  it('should throw AppError 400 when username is missing or empty string', async () => {
    await assert.rejects(
      async () => {
        await userService.findByUsername('');
      },
      (err) => {
        assert.equal(err.statusCode, 400);
        assert.equal(err.message, 'Username is required');
        return true;
      }
    );

    await assert.rejects(
      async () => {
        await userService.findByUsername('   ');
      },
      (err) => {
        assert.equal(err.statusCode, 400);
        assert.equal(err.message, 'Username is required');
        return true;
      }
    );
  });
});

describe('FollowService Validation Tests', () => {
  const followService = require('../services/FollowService');

  it('should throw AppError 400 when user attempts to follow themselves', async () => {
    await assert.rejects(
      async () => {
        await followService.toggleFollow(10, 10);
      },
      (err) => {
        assert.equal(err.statusCode, 400);
        assert.equal(err.message, 'You cannot follow yourself');
        return true;
      }
    );
  });

  it('should throw AppError 400 when follower or target ID is invalid', async () => {
    await assert.rejects(
      async () => {
        await followService.toggleFollow('invalid', 5);
      },
      (err) => {
        assert.equal(err.statusCode, 400);
        assert.equal(err.message, 'Invalid user ID provided');
        return true;
      }
    );

    await assert.rejects(
      async () => {
        await followService.getFollowers('not-a-number');
      },
      (err) => {
        assert.equal(err.statusCode, 400);
        assert.equal(err.message, 'Invalid user ID provided');
        return true;
      }
    );
  });
});

describe('CategoryService & CommentService Validation Tests', () => {
  const categoryService = require('../services/CategoryService');
  const commentService = require('../services/CommentService');

  it('should throw AppError 404 when category is not found by ID', async () => {
    const { Category } = require('../models');
    const originalFindByPk = Category.findByPk;
    Category.findByPk = async () => null;

    try {
      await assert.rejects(
        async () => {
          await categoryService.findById(99999);
        },
        (err) => {
          assert.equal(err.statusCode, 404);
          assert.equal(err.message, 'Category not found');
          return true;
        }
      );
    } finally {
      Category.findByPk = originalFindByPk;
    }
  });

  it('should reject deleting comment if currentUser is not the comment owner', async () => {
    const { Comment } = require('../models');
    const originalFindByPk = Comment.findByPk;
    Comment.findByPk = async () => ({ id: 1, userId: 10, destroy: async () => {} });

    try {
      await assert.rejects(
        async () => {
          await commentService.delete(1, { id: 99 });
        },
        (err) => {
          assert.equal(err.statusCode, 403);
          assert.equal(err.message, 'You are not allowed to delete this comment');
          return true;
        }
      );
    } finally {
      Comment.findByPk = originalFindByPk;
    }
  });
});
