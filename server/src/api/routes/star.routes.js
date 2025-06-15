const express = require('express');
const router = express.Router();
const starController = require('../../controllers/star.controller');
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware');
const { uploadImage, uploadVideo, handleUploadError } = require('../../middlewares/upload.middleware');

// 公共路由 - 无需认证
// 获取太空地图视频
router.get('/videos', starController.getVideoByType);

// 获取宇宙知识A4页面
router.get('/a4content', starController.getA4Content);

// 管理员路由 - 需要认证和管理员权限
// 创建新视频
router.post('/admin/videos', authenticate, isAdmin, starController.createVideo);

// 创建新A4内容
router.post('/admin/a4content', authenticate, isAdmin, starController.createA4Content);

// 获取所有视频
router.get('/admin/videos', authenticate, isAdmin, starController.getAllVideos);

// 获取所有A4内容
router.get('/admin/a4content', authenticate, isAdmin, starController.getAllA4Contents);

// 更新视频
router.put('/admin/videos/:id', authenticate, isAdmin, starController.updateVideo);

// 更新A4内容
router.put('/admin/a4content/:id', authenticate, isAdmin, starController.updateA4Content);

// 删除视频
router.delete('/admin/videos/:id', authenticate, isAdmin, starController.deleteVideo);

// 删除A4内容
router.delete('/admin/a4content/:id', authenticate, isAdmin, starController.deleteA4Content);

// 上传视频封面图片
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

// 上传视频
router.post('/admin/upload/video', authenticate, isAdmin, uploadVideo, handleUploadError, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '未提供视频文件'
    });
  }
  
  res.json({
    success: true,
    data: {
      videoUrl: `/uploads/videos/${req.file.filename}`
    }
  });
});

module.exports = router; 