// 用户头像上传API - 开发分支新功能
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB限制
  },
  fileFilter: function (req, file, cb) {
    // 只允许图片文件
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件！'), false);
    }
  }
});

// 上传头像接口
router.post('/upload', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的头像文件'
      });
    }

    // 这里应该更新用户数据库中的头像字段
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    // TODO: 更新用户头像到数据库
    // await User.updateOne(
    //   { _id: req.user.id }, 
    //   { avatar: avatarUrl }
    // );

    res.json({
      success: true,
      message: '头像上传成功',
      data: {
        avatarUrl: avatarUrl,
        filename: req.file.filename,
        size: req.file.size
      }
    });

  } catch (error) {
    console.error('头像上传失败:', error);
    res.status(500).json({
      success: false,
      message: '头像上传失败',
      error: error.message
    });
  }
});

// 获取用户头像
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // TODO: 从数据库获取用户头像
    // const user = await User.findById(userId);
    // if (!user || !user.avatar) {
    //   return res.status(404).json({
    //     success: false,
    //     message: '用户头像不存在'
    //   });
    // }

    // 临时返回默认头像
    res.json({
      success: true,
      data: {
        avatarUrl: '/uploads/avatars/default-avatar.png',
        userId: userId
      }
    });

  } catch (error) {
    console.error('获取头像失败:', error);
    res.status(500).json({
      success: false,
      message: '获取头像失败',
      error: error.message
    });
  }
});

// 删除头像
router.delete('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // TODO: 删除用户头像文件和数据库记录
    
    res.json({
      success: true,
      message: '头像删除成功'
    });

  } catch (error) {
    console.error('删除头像失败:', error);
    res.status(500).json({
      success: false,
      message: '删除头像失败',
      error: error.message
    });
  }
});

module.exports = router; 