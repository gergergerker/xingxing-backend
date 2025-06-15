const express = require('express');
const router = express.Router();
const exploreController = require('../../controllers/explore.controller');
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware');
const { uploadImage, uploadAudio, uploadVideo, uploadDocument, handleUploadError } = require('../../middlewares/upload.middleware');

// 公共路由 - 无需认证
// 获取文章列表
router.get('/articles', exploreController.getArticles);

// 获取文章详情
router.get('/article/detail', exploreController.getArticleDetail);

// 获取文章音频
router.get('/article/audio', exploreController.getArticleAudio);

// 获取文章打印页
router.get('/article/print', exploreController.getArticlePrint);

// 获取文章习题
router.get('/article/exercises', exploreController.getArticleExercises);

// 提交习题答案
router.post('/exercises/submit', authenticate, exploreController.submitExerciseAnswer);

// 获取视频列表
router.get('/videos', exploreController.getVideos);

// 获取视频详情
router.get('/video/detail', exploreController.getVideoDetail);

// 管理员路由 - 需要认证和管理员权限
// 创建文章
router.post('/admin/article', authenticate, isAdmin, exploreController.createArticle);

// 创建视频
router.post('/admin/video', authenticate, isAdmin, exploreController.createVideo);

// 获取所有文章
router.get('/admin/articles', authenticate, isAdmin, exploreController.getAllArticles);

// 获取所有视频
router.get('/admin/videos', authenticate, isAdmin, exploreController.getAllVideos);

// 更新文章
router.put('/admin/article/:id', authenticate, isAdmin, exploreController.updateArticle);

// 更新视频
router.put('/admin/video/:id', authenticate, isAdmin, exploreController.updateVideo);

// 删除文章
router.delete('/admin/article/:id', authenticate, isAdmin, exploreController.deleteArticle);

// 删除视频
router.delete('/admin/video/:id', authenticate, isAdmin, exploreController.deleteVideo);

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

// 上传PDF文档
router.post('/admin/upload/document', authenticate, isAdmin, uploadDocument, handleUploadError, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '未提供文档文件'
    });
  }
  
  res.json({
    success: true,
    data: {
      documentUrl: `/uploads/documents/${req.file.filename}`
    }
  });
});

module.exports = router; 