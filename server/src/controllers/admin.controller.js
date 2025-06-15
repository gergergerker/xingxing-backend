const User = require('../models/User');
const Article = require('../models/Article');
const Video = require('../models/Video');
const StarVideo = require('../models/StarVideo');
const A4Content = require('../models/A4Content');
const StarMap = require('../models/StarMap');
const MemberPlan = require('../models/MemberPlan');
const QRCode = require('../models/QRCode');
const config = require('../config/config');

// 初始化超级管理员
const initAdmin = async (req, res) => {
  try {
    // 检查是否已存在超级管理员
    const adminExists = await User.findOne({ role: 'superadmin' });
    
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: '超级管理员已存在'
      });
    }

    // 验证请求中的初始化密钥
    const { initKey } = req.body;
    
    if (!initKey || initKey !== config.adminInitKey) {
      return res.status(403).json({
        success: false,
        message: '无效的初始化密钥'
      });
    }
    
    // 创建超级管理员
    const admin = new User({
      email: config.defaultAdmin.email,
      password: config.defaultAdmin.password,
      nickName: config.defaultAdmin.nickname,
      role: 'superadmin'
    });
    
    await admin.save();
    
    res.status(201).json({
      success: true,
      message: '超级管理员已初始化',
      data: {
        email: admin.email,
        nickName: admin.nickName
      }
    });
  } catch (error) {
    console.error('初始化超级管理员错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取系统概览数据
const getDashboardStats = async (req, res) => {
  try {
    // 统计各类数据数量
    const userCount = await User.countDocuments();
    const memberCount = await User.countDocuments({ 
      memberLevel: { $gt: 0 },
      expireDate: { $gt: new Date() }
    });
    
    const articleCount = await Article.countDocuments();
    const videoCount = await Video.countDocuments();
    const starVideoCount = await StarVideo.countDocuments();
    const a4ContentCount = await A4Content.countDocuments();
    const starMapCount = await StarMap.countDocuments();
    
    // 统计今日注册用户
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayUserCount = await User.countDocuments({
      createdAt: { $gte: today }
    });
    
    // 统计各类用户数量
    const userRoleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // 格式化用户角色统计
    const roleStats = {};
    userRoleStats.forEach(item => {
      roleStats[item._id] = item.count;
    });
    
    // 统计各类内容数量
    const contentStats = {
      articles: articleCount,
      videos: videoCount,
      starVideos: starVideoCount,
      a4Contents: a4ContentCount,
      starMaps: starMapCount
    };
    
    // 最近注册的5个用户
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('nickName avatarUrl createdAt role');
    
    // 构建响应数据
    const stats = {
      userCount,
      memberCount,
      memberRate: userCount > 0 ? (memberCount / userCount * 100).toFixed(2) + '%' : '0%',
      todayUserCount,
      roleStats,
      contentStats,
      recentUsers
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('获取仪表盘统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取内容统计
const getContentStats = async (req, res) => {
  try {
    // 统计各类型文章数量
    const articleTypeStats = await Article.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // 统计各类型视频数量
    const videoTypeStats = await StarVideo.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // 统计各类型A4内容数量
    const a4TypeStats = await A4Content.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // 统计各类型星图数量
    const starMapTypeStats = await StarMap.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // 构建响应数据
    const stats = {
      articleStats: articleTypeStats,
      videoStats: videoTypeStats,
      a4Stats: a4TypeStats,
      starMapStats: starMapTypeStats
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('获取内容统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取用户统计
const getUserStats = async (req, res) => {
  try {
    // 统计每个会员等级的用户数量
    const memberLevelStats = await User.aggregate([
      {
        $group: {
          _id: '$memberLevel',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // 统计过去7天内的注册用户
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const dailyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);
    
    // 格式化日期
    const formattedDailyRegistrations = dailyRegistrations.map(item => {
      const date = new Date(item._id.year, item._id.month - 1, item._id.day);
      return {
        date: date.toISOString().split('T')[0],
        count: item.count
      };
    });
    
    // 构建响应数据
    const stats = {
      memberLevelStats,
      dailyRegistrations: formattedDailyRegistrations
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('获取用户统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

module.exports = {
  initAdmin,
  getDashboardStats,
  getContentStats,
  getUserStats
}; 