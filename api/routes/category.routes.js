const { Router } = require('express');
const categoryController = require('../controllers/CategoryController');
const authenticate = require('../middlewares/authenticate');
const authorizeAdmin = require('../middlewares/authorizeAdmin');

const router = Router();

router.get('/', categoryController.getAll);
// Bonus: create category (admin required)
router.post('/', authenticate, authorizeAdmin, categoryController.create);

module.exports = router;
