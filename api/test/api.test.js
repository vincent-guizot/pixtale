const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const ApiResponse = require('../utils/ApiResponse');
const JwtUtil = require('../utils/JwtUtil');
const errorHandler = require('../middlewares/errorHandler');
const optionalAuth = require('../middlewares/optionalAuth');
const upload = require('../middlewares/upload');

describe('ApiResponse Helper Tests', () => {
  it('should format success response correctly', () => {
    let statusCode = null;
    let jsonBody = null;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };

    ApiResponse.success(res, { message: 'OK', data: { id: 1 }, statusCode: 200 });
    assert.equal(statusCode, 200);
    assert.deepEqual(jsonBody, { status: 'success', message: 'OK', data: { id: 1 } });
  });

  it('should format error response correctly', () => {
    let statusCode = null;
    let jsonBody = null;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };

    ApiResponse.error(res, { message: 'Not found', details: 'Item missing', statusCode: 404 });
    assert.equal(statusCode, 404);
    assert.deepEqual(jsonBody, { status: 'error', message: 'Not found', details: 'Item missing' });
  });
});

describe('JwtUtil Tests', () => {
  it('should sign and verify valid payload', () => {
    process.env.JWT_SECRET = 'test-secret';
    const token = JwtUtil.sign({ id: 99, role: 'user' });
    assert.ok(token);

    const decoded = JwtUtil.verify(token);
    assert.equal(decoded.id, 99);
    assert.equal(decoded.role, 'user');
  });
});

describe('ErrorHandler Middleware Tests', () => {
  it('should map SequelizeValidationError to HTTP 400', () => {
    let statusCode = null;
    let jsonBody = null;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };

    const err = {
      name: 'SequelizeValidationError',
      errors: [{ message: 'Validation isEmail on email failed' }],
    };

    errorHandler(err, {}, res, () => {});
    assert.equal(statusCode, 400);
    assert.equal(jsonBody.status, 'error');
    assert.equal(jsonBody.details, 'Validation isEmail on email failed');
  });

  it('should sanitize 500 error details in production', () => {
    const prevEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    let statusCode = null;
    let jsonBody = null;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };

    const err = new Error('FATAL: connection to server failed at 127.0.0.1');
    errorHandler(err, {}, res, () => {});

    assert.equal(statusCode, 500);
    assert.equal(jsonBody.message, 'Internal server error');
    assert.equal(jsonBody.details, null);

    process.env.NODE_ENV = prevEnv;
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
    process.env.JWT_SECRET = 'test-secret';
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
