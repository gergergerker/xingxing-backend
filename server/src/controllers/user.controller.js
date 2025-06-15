const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// 上传头像
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '未提供头像文件'
      });
    }
    
    // 查询用户
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 如果用户已有头像，删除旧头像文件
    if (user.avatarUrl && user.avatarUrl.startsWith('/uploads/')) {
      const oldAvatarPath = path.join(__dirname, '../../../', user.avatarUrl);
      
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }
    
    // 设置新头像URL
    const avatarUrl = `/uploads/images/${req.file.filename}`;
    user.avatarUrl = avatarUrl;
    
    await user.save();
    
    res.json({
      success: true,
      data: {
        avatarUrl
      }
    });
  } catch (error) {
    console.error('上传头像错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 获取所有用户
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('获取所有用户错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 获取用户详情
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('获取用户详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 更新用户
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nickName, email, role, memberLevel, expireDate, tags } = req.body;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 更新字段
    if (nickName) user.nickName = nickName;
    if (email) user.email = email;
    if (role && ['user', 'admin', 'superadmin'].includes(role)) user.role = role;
    if (memberLevel !== undefined) user.memberLevel = memberLevel;
    if (expireDate) user.expireDate = expireDate;
    if (tags) user.tags = tags;
    
    await user.save();
    
    res.json({
      success: true,
      data: {
        id: user._id,
        nickName: user.nickName,
        email: user.email,
        role: user.role,
        memberLevel: user.memberLevel,
        expireDate: user.expireDate,
        tags: user.tags
      }
    });
  } catch (error) {
    console.error('更新用户错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 重置用户密码
const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: '请提供新密码'
      });
    }
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 重置密码
    user.password = newPassword;
    
    await user.save();
    
    res.json({
      success: true,
      message: '密码已重置'
    });
  } catch (error) {
    console.error('重置用户密码错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 设置用户会员状态
const setUserMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberLevel, expireDate } = req.body;
    
    if (memberLevel === undefined || !expireDate) {
      return res.status(400).json({
        success: false,
        message: '请提供会员等级和到期日期'
      });
    }
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 设置会员状态
    user.memberLevel = memberLevel;
    user.expireDate = expireDate;
    
    await user.save();
    
    res.json({
      success: true,
      message: '会员状态已更新',
      data: {
        memberLevel: user.memberLevel,
        expireDate: user.expireDate,
        isMember: user.isMember()
      }
    });
  } catch (error) {
    console.error('设置用户会员状态错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 删除用户
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 防止删除超级管理员
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    if (user.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: '不能删除超级管理员'
      });
    }
    
    await User.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: '用户已删除'
    });
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

module.exports = {
  uploadAvatar,
  getAllUsers,
  getUserById,
  updateUser,
  resetUserPassword,
  setUserMembership,
  deleteUser
}; 