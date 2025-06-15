const express = require('express');
const router = express.Router();
const observeController = require('../../controllers/observe.controller');
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware');
const { uploadImage, uploadAudio, handleUploadError } = require('../../middlewares/upload.middleware');

// 公共路由 - 无需认证
// 获取北斗七星A4页面
router.get('/beidou/a4content', observeController.getBeiDouA4Content);

// 获取朗读音频
router.get('/audio', observeController.getAudio);

// 管理员路由 - 需要认证和管理员权限
// 创建北斗七星A4内容
router.post('/admin/beidou', authenticate, isAdmin, observeController.createBeiDouContent);

// 获取所有北斗七星A4内容
router.get('/admin/beidou', authenticate, isAdmin, observeController.getAllBeiDouContents);

// 更新北斗七星A4内容
router.put('/admin/beidou/:id', authenticate, isAdmin, observeController.updateBeiDouContent);

// 删除北斗七星A4内容
router.delete('/admin/beidou/:id', authenticate, isAdmin, observeController.deleteBeiDouContent);

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

// 上传音频
router.post('/admin/upload/audio', authenticate, isAdmin, uploadAudio, handleUploadError, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '未提供音频文件'
    });
  }
  
  res.json({
    success: true,
    data: {
      audioUrl: `/uploads/audios/${req.file.filename}`
    }
  });
});

module.exports = router; 