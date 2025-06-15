const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

// 普通登录
router.post('/login', authController.login);

// 注册
router.post('/register', authController.register);

// 微信登录
router.post('/wechat', authController.wechatLogin);

// 获取当前用户信息
router.get('/me', authenticate, authController.me);

module.exports = router;