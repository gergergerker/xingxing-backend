const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

// 验证JWT令牌
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供有效的认证令牌'
      });
    }
    
    // 验证令牌
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // 查找用户
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 将用户信息添加到请求对象
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的令牌'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '令牌已过期'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 验证是否为管理员
const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin' && req.userRole !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: '需要管理员权限'
    });
  }
  
  next();
};

// 验证是否为超级管理员
const isSuperAdmin = (req, res, next) => {
  if (req.userRole !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: '需要超级管理员权限'
    });
  }
  
  next();
};

// 验证是否为会员
const isMember = (req, res, next) => {
  if (!req.user.isMember()) {
    return res.status(403).json({
      success: false,
      message: '需要会员权限'
    });
  }
  
  next();
};

module.exports = {
  authenticate,
  isAdmin,
  isSuperAdmin,
  isMember
}; 