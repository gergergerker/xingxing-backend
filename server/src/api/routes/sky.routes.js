const express = require('express');
const router = express.Router();
const skyController = require('../../controllers/sky.controller');
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware');
const { uploadImage, handleUploadError } = require('../../middlewares/upload.middleware');

// 公共路由 - 无需认证
// 获取华夏星空星图
router.get('/chinese/starmap', skyController.getChineseStarMap);

// 获取28星宿卡片
router.get('/xingxiu/cards', skyController.getXingXiuCards);

// 获取星宿详情
router.get('/xingxiu/detail', skyController.getXingXiuDetail);

// 获取星宿功能
router.get('/xingxiu/functions', skyController.getXingXiuFunctions);

// 获取星象表达
router.get('/expressions', skyController.getStarExpressions);

// 管理员路由 - 需要认证和管理员权限
// 创建星图
router.post('/admin/starmap', authenticate, isAdmin, skyController.createStarMap);

// 获取所有星图
router.get('/admin/starmap', authenticate, isAdmin, skyController.getAllStarMaps);

// 更新星图
router.put('/admin/starmap/:id', authenticate, isAdmin, skyController.updateStarMap);

// 删除星图
router.delete('/admin/starmap/:id', authenticate, isAdmin, skyController.deleteStarMap);

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