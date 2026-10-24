const { Router } = require('express');
const likeController = require('../controllers/LikeController');
const authenticate = require('../middlewares/authenticate');

const router = Router();

router.post('/:postId', authenticate, likeController.like);
router.delete('/:postId', authenticate, likeController.unlike);

module.exports = router;
