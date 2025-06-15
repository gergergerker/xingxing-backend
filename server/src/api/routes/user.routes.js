const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware');
const { uploadImage, handleUploadError } = require('../../middlewares/upload.middleware');

// 上传头像
router.post('/upload-avatar', authenticate, uploadImage, handleUploadError, userController.uploadAvatar);

// 管理员路由 - 需要认证和管理员权限
// 获取所有用户
router.get('/admin/users', authenticate, isAdmin, userController.getAllUsers);

// 获取用户详情
router.get('/admin/user/:id', authenticate, isAdmin, userController.getUserById);

// 更新用户
router.put('/admin/user/:id', authenticate, isAdmin, userController.updateUser);

// 重置用户密码
router.post('/admin/user/:id/reset-password', authenticate, isAdmin, userController.resetUserPassword);

// 设置用户会员状态
router.post('/admin/user/:id/membership', authenticate, isAdmin, userController.setUserMembership);

// 删除用户
router.delete('/admin/user/:id', authenticate, isAdmin, userController.deleteUser);

module.exports = router; 