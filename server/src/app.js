const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// 导入配置
const config = require('./config/config');

// 导入API路由
const apiRoutes = require('./api');

// 创建Express应用
const app = express();

// 连接数据库
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB 连接成功'))
.catch(err => console.error('MongoDB 连接错误:', err));

// 中间件
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

// 自定义 helmet 配置以允许内联脚本
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'", "https:", "data:"]
    }
  }
}));

app.use(compression()); // GZIP压缩
app.use(express.json({ limit: '10mb' })); // 解析JSON请求体
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // 解析URL编码请求体
app.use(morgan('dev')); // 日志

// 设置静态文件目录
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));
app.use('/admin', express.static(path.join(__dirname, '..', '..', 'public/admin'), {
  index: 'index.html'
}));
app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')));

// API速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP在windowMs时间内最多100个请求
  standardHeaders: true,
  legacyHeaders: false
});
app.use(config.apiPath, limiter);

// 路由
app.use(config.apiPath, apiRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误'
  });
});

// 只处理API请求的404，静态文件请求交给Express默认处理
app.use(config.apiPath, (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 添加默认路由，将根路径重定向到管理页面
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// 添加API状态检查路由
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '欢迎使用晓视界微信小程序API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

module.exports = app; 