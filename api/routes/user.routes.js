const { Router } = require('express');
const userController = require('../controllers/UserController');
const authenticate = require('../middlewares/authenticate');
const optionalAuth = require('../middlewares/optionalAuth');

const router = Router();

// /suggestions harus didefinisikan sebelum /:username
router.get('/suggestions', optionalAuth, userController.getSuggestions);
router.post('/:id/follow', authenticate, userController.toggleFollow);
router.get('/:id/followers', optionalAuth, userController.getFollowers);
router.get('/:id/following', optionalAuth, userController.getFollowing);
router.get('/:username', optionalAuth, userController.getByUsername);

module.exports = router;
