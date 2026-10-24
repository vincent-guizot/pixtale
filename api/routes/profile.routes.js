const { Router } = require('express');
const profileController = require('../controllers/ProfileController');
const authenticate = require('../middlewares/authenticate');

const router = Router();

router.get('/', authenticate, profileController.getMyProfile);
router.put('/', authenticate, profileController.updateMyProfile);

module.exports = router;
