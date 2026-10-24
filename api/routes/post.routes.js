const { Router } = require('express');
const postController = require('../controllers/PostController');
const authenticate = require('../middlewares/authenticate');
const optionalAuth = require('../middlewares/optionalAuth');

const router = Router();

router.get('/', optionalAuth, postController.getAll);
router.get('/:id', optionalAuth, postController.getById);
router.post('/', authenticate, postController.create);
router.put('/:id', authenticate, postController.update);
router.delete('/:id', authenticate, postController.delete);

module.exports = router;
