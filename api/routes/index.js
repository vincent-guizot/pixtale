const { Router } = require('express');

const authRoutes = require('./auth.routes');
const postRoutes = require('./post.routes');
const categoryRoutes = require('./category.routes');
const commentRoutes = require('./comment.routes');
const likeRoutes = require('./like.routes');
const profileRoutes = require('./profile.routes');
const notificationRoutes = require('./notification.routes');
const uploadRoutes = require('./upload.routes');
const userRoutes = require('./user.routes');

const router = Router();

router.use('/', authRoutes); // /register, /login
router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);
router.use('/comments', commentRoutes);
router.use('/likes', likeRoutes);
router.use('/profile', profileRoutes);
router.use('/notifications', notificationRoutes);
router.use('/upload', uploadRoutes);
router.use('/users', userRoutes);

module.exports = router;
