const JwtUtil = require('../utils/JwtUtil');

/**
 * Memeriksa Bearer token jika ada di header Authorization.
 * Jika token valid, taruh decoded payload ({ id, role }) ke req.user.
 * Jika tidak ada token atau token tidak valid, req.user tetap null/undefined
 * dan request tetap dilanjutkan (tidak melempar 401).
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = JwtUtil.verify(token);
      req.user = decoded;
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};
