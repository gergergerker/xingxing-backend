const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/profile.controller');
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware');
const { uploadImage, handleUploadError } = require('../../middlewares/upload.middleware');

// 公共路由 - 无需认证
// 获取客服二维码
router.get('/qrcode', profileController.getQRCode);

// 获取会员宣传A4页面
router.get('/member/promotion', profileController.getMemberPromotion);

// 获取会员方案列表
router.get('/member/plans', profileController.getMemberPlans);

// 受保护路由 - 需要认证
// 获取用户资料
router.get('/user/profile', authenticate, profileController.getUserProfile);

// 更新用户资料
router.post('/user/update-profile', authenticate, profileController.updateUserProfile);

// 获取会员信息
router.get('/user/member-info', authenticate, profileController.getMemberInfo);

// 获取通知设置
router.get('/user/notification/settings', authenticate, profileController.getNotificationSettings);

// 更新通知设置
router.post('/user/notification/settings', authenticate, profileController.updateNotificationSettings);

// 管理员路由 - 需要认证和管理员权限
// 创建会员方案
router.post('/admin/member/plan', authenticate, isAdmin, profileController.createMemberPlan);

// 创建二维码
router.post('/admin/qrcode', authenticate, isAdmin, profileController.createQRCode);

// 创建会员宣传A4
router.post('/admin/member/promotion', authenticate, isAdmin, profileController.createMemberPromotion);

// 获取所有会员方案
router.get('/admin/member/plans', authenticate, isAdmin, profileController.getAllMemberPlans);

// 获取所有二维码
router.get('/admin/qrcodes', authenticate, isAdmin, profileController.getAllQRCodes);

// 更新会员方案
router.put('/admin/member/plan/:id', authenticate, isAdmin, profileController.updateMemberPlan);

// 更新二维码
router.put('/admin/qrcode/:id', authenticate, isAdmin, profileController.updateQRCode);

// 删除会员方案
router.delete('/admin/member/plan/:id', authenticate, isAdmin, profileController.deleteMemberPlan);

// 删除二维码
router.delete('/admin/qrcode/:id', authenticate, isAdmin, profileController.deleteQRCode);

// 上传图片
router.post('/admin/upload/image', authenticate, isAdmin, uploadImage, handleUploadError, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '未提供图片文件'
    });
  }
  
  res.json({
    success: true,
    data: {
      imageUrl: `/uploads/images/${req.file.filename}`
    }
  });
});

module.exports = router; 