const { Router } = require('express');
const commentController = require('../controllers/CommentController');
const authenticate = require('../middlewares/authenticate');

const router = Router();

router.post('/', authenticate, commentController.create);
router.delete('/:id', authenticate, commentController.delete);

module.exports = router;
