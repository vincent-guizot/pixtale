const { Router } = require('express');
const notificationController = require('../controllers/NotificationController');
const authenticate = require('../middlewares/authenticate');

const router = Router();

router.get('/', authenticate, notificationController.getAll);
router.put('/read-all', authenticate, notificationController.markAllAsRead);
router.put('/:id/read', authenticate, notificationController.markAsRead);

module.exports = router;
