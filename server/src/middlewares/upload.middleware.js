const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

// 确保上传目录存在
const createUploadDirs = () => {
  // 使用基础目录
  const baseDir = path.join(__dirname, '../../..', 'uploads');
  const subdirs = ['images', 'videos', 'audios', 'documents', 'temp', 'avatars', 'qrcodes', 'articles'];
  
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  
  subdirs.forEach(dir => {
    const fullPath = path.join(baseDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
};

// 创建上传目录
createUploadDirs();

// 存储设置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, '../../..', 'uploads');
    
    // 根据文件类型设置不同的上传目录
    if (file.mimetype.startsWith('image/')) {
      uploadPath = path.join(uploadPath, 'images');
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath = path.join(uploadPath, 'videos');
    } else if (file.mimetype.startsWith('audio/')) {
      uploadPath = path.join(uploadPath, 'audios');
    } else if (file.mimetype === 'application/pdf') {
      uploadPath = path.join(uploadPath, 'documents');
    } else {
      uploadPath = path.join(uploadPath, 'temp');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 允许的文件类型
  const allowedTypes = {
    'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    'video': ['video/mp4', 'video/webm', 'video/quicktime'],
    'audio': ['audio/mpeg', 'audio/wav', 'audio/mp3'],
    'document': ['application/pdf']
  };
  
  // 检查文件类型
  let isAllowed = false;
  const type = file.fieldname.split('-')[0]; // 假设字段名以类型开头，如 'image-upload'
  
  if (type === 'image' && allowedTypes.image.includes(file.mimetype)) {
    isAllowed = true;
  } else if (type === 'video' && allowedTypes.video.includes(file.mimetype)) {
    isAllowed = true;
  } else if (type === 'audio' && allowedTypes.audio.includes(file.mimetype)) {
    isAllowed = true;
  } else if (type === 'document' && allowedTypes.document.includes(file.mimetype)) {
    isAllowed = true;
  } else if (type === 'file') {
    // 通用文件上传，允许所有类型
    isAllowed = true;
  }
  
  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'), false);
  }
};

// 创建上传实例
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.fileStorage?.maxFileSize || 50 * 1024 * 1024 // 默认最大 50MB
  }
});

// 图片上传中间件
const uploadImage = upload.single('image-upload');

// 视频上传中间件
const uploadVideo = upload.single('video-upload');

// 音频上传中间件
const uploadAudio = upload.single('audio-upload');

// PDF文档上传中间件
const uploadDocument = upload.single('document-upload');

// 多文件上传中间件
const uploadMultiple = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 2 },
  { name: 'audios', maxCount: 5 },
  { name: 'documents', maxCount: 5 }
]);

// 处理上传错误
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '文件大小超过限制'
      });
    }
    return res.status(400).json({
      success: false,
      message: `上传错误: ${err.message}`
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

module.exports = {
  uploadImage,
  uploadVideo,
  uploadAudio,
  uploadDocument,
  uploadMultiple,
  handleUploadError
}; 