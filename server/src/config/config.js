require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/xiaoshijie',
  apiPath: '/api',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  defaultAdmin: {
    email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@xiaoshijie.com',
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123',
    nickname: '晓视界超级管理员'
  },
  adminInitKey: process.env.ADMIN_INIT_KEY || 'xiaoshijie-secret-init-key',
  systemName: '晓视界后台管理系统',
  fileStorage: {
    avatarPath: process.env.AVATAR_PATH || 'uploads/avatars',
    qrcodePath: process.env.QRCODE_PATH || 'uploads/qrcodes',
    articlePath: process.env.ARTICLE_PATH || 'uploads/articles',
    videoPath: process.env.VIDEO_PATH || 'uploads/videos',
    maxFileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024 // 5MB
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 50
  }
};

module.exports = config; 