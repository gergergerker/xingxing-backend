const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 普通登录
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 验证请求字段
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '请提供邮箱和密码'
      });
    }
    
    // 查找用户
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }
    
    // 验证密码
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }
    
    // 生成令牌
    const token = user.generateAuthToken();
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          nickName: user.nickName,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          isMember: user.isMember()
        }
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 注册
const register = async (req, res) => {
  try {
    const { email, password, nickName } = req.body;
    
    // 验证请求字段
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '请提供邮箱和密码'
      });
    }
    
    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }
    
    // 创建新用户 - 只允许注册普通用户
    const user = new User({
      email,
      password,
      nickName: nickName || '新用户',
      role: 'user' // 强制设置为普通用户角色
    });
    
    await user.save();
    
    // 生成令牌
    const token = user.generateAuthToken();
    
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          nickName: user.nickName,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 微信登录
const wechatLogin = async (req, res) => {
  try {
    const { code, userInfo } = req.body;
    
    // 验证请求字段
    if (!code) {
      return res.status(400).json({
        success: false,
        message: '请提供登录code'
      });
    }
    
    // 这里应该调用微信API来获取openId和用户信息
    // 实际实现中，需要调用微信API获取openId
    // 以下是模拟实现，实际项目中应替换为真实API调用
    const openId = 'wechat_' + code; // 模拟生成openId
    
    // 查找是否存在该微信用户
    let user = await User.findOne({ openId });
    
    // 如果不存在，创建新用户
    if (!user) {
      user = new User({
        openId,
        nickName: userInfo?.nickName || '微信用户',
        avatarUrl: userInfo?.avatarUrl,
        role: 'user'
      });
      
      await user.save();
    }
    
    // 生成令牌
    const token = user.generateAuthToken();
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          nickName: user.nickName,
          avatarUrl: user.avatarUrl,
          role: user.role,
          isMember: user.isMember()
        }
      }
    });
  } catch (error) {
    console.error('微信登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取当前用户信息
const me = async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      data: {
        id: user._id,
        nickName: user.nickName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: user.role,
        tags: user.tags,
        memberLevel: user.memberLevel,
        expireDate: user.expireDate,
        checkinDays: user.checkinDays,
        continuousDays: user.continuousDays,
        isMember: user.isMember(),
        notificationSettings: user.notificationSettings
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

module.exports = {
  login,
  register,
  wechatLogin,
  me
}; 