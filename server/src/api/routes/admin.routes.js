const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin.controller');
const { authenticate, isAdmin, isSuperAdmin } = require('../../middlewares/auth.middleware');

// 初始化超级管理员 - 无需认证
router.post('/init', adminController.initAdmin);

// 管理员路由 - 需要认证和管理员权限
// 获取仪表盘统计数据
router.get('/dashboard', authenticate, isAdmin, adminController.getDashboardStats);

// 获取内容统计
router.get('/content-stats', authenticate, isAdmin, adminController.getContentStats);

// 获取用户统计
router.get('/user-stats', authenticate, isAdmin, adminController.getUserStats);

module.exports = router; 