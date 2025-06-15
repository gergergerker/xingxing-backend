const express = require('express');
const router = express.Router();

// 导入各模块路由
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const starRoutes = require('./routes/star.routes');
const observeRoutes = require('./routes/observe.routes');
const skyRoutes = require('./routes/sky.routes');
const exploreRoutes = require('./routes/explore.routes');
const profileRoutes = require('./routes/profile.routes');
const adminRoutes = require('./routes/admin.routes');

// 注册路由
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/star', starRoutes);
router.use('/observe', observeRoutes);
router.use('/sky', skyRoutes); 
router.use('/explore', exploreRoutes);
router.use('/profile', profileRoutes);
router.use('/admin', adminRoutes);

// 健康检查路由
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '服务正常运行',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 