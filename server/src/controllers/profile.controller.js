const User = require('../models/User');
const MemberPlan = require('../models/MemberPlan');
const QRCode = require('../models/QRCode');
const A4Content = require('../models/A4Content');

// 获取客服二维码
const getQRCode = async (req, res) => {
  try {
    // 查询客服二维码
    const qrCode = await QRCode.findOne({ 
      type: '客服',
      isActive: true
    });
    
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: '未找到客服二维码'
      });
    }
    
    res.json({
      success: true,
      data: {
        qrCodeUrl: qrCode.imageUrl,
        description: qrCode.description
      }
    });
  } catch (error) {
    console.error('获取客服二维码错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取会员宣传A4页面
const getMemberPromotion = async (req, res) => {
  try {
    // 查询会员宣传A4内容
    const promotion = await A4Content.findOne({ 
      type: 'member',
      category: 'promotion',
      isActive: true
    });
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: '未找到会员宣传内容'
      });
    }
    
    res.json({
      success: true,
      data: {
        imageUrl: promotion.imageUrl,
        title: promotion.title,
        description: promotion.description
      }
    });
  } catch (error) {
    console.error('获取会员宣传错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取会员方案列表
const getMemberPlans = async (req, res) => {
  try {
    // 查询会员方案
    const plans = await MemberPlan.find({ 
      isActive: true 
    }).sort({ order: 1 });
    
    if (!plans || plans.length === 0) {
      return res.status(404).json({
        success: false,
        message: '未找到会员方案'
      });
    }
    
    // 格式化响应数据
    const formattedPlans = plans.map(plan => ({
      id: plan._id,
      name: plan.name,
      price: plan.price,
      originalPrice: plan.originalPrice,
      period: plan.period,
      features: plan.features,
      recommended: plan.recommended
    }));
    
    res.json({
      success: true,
      data: {
        plans: formattedPlans
      }
    });
  } catch (error) {
    console.error('获取会员方案错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取用户资料
const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    
    // 查询用户
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      data: {
        nickName: user.nickName,
        avatarUrl: user.avatarUrl,
        userId: user._id,
        memberLevel: user.memberLevel,
        expireDate: user.expireDate,
        checkinDays: user.checkinDays,
        tags: user.tags,
        isMember: user.isMember()
      }
    });
  } catch (error) {
    console.error('获取用户资料错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 更新用户资料
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { nickName, learningGoal, tags } = req.body;
    
    // 查询用户
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 更新字段
    if (nickName) user.nickName = nickName;
    if (learningGoal !== undefined) user.learningGoal = learningGoal;
    if (tags) user.tags = tags;
    
    await user.save();
    
    res.json({
      success: true,
      message: '更新成功'
    });
  } catch (error) {
    console.error('更新用户资料错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取会员信息
const getMemberInfo = async (req, res) => {
  try {
    const userId = req.userId;
    
    // 查询用户
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 设置会员特权
    const memberPrivileges = [
      '解锁所有A4打印页面',
      '所有文章音频解锁',
      '专属会员标识',
      '优先更新内容'
    ];
    
    if (user.memberLevel >= 2) {
      memberPrivileges.push('专属定制内容');
      memberPrivileges.push('专家一对一问答');
    }
    
    res.json({
      success: true,
      data: {
        memberLevel: user.memberLevel,
        expireDate: user.expireDate,
        memberPrivileges,
        isMember: user.isMember()
      }
    });
  } catch (error) {
    console.error('获取会员信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取通知设置
const getNotificationSettings = async (req, res) => {
  try {
    const userId = req.userId;
    
    // 查询用户
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      data: {
        settings: user.notificationSettings || {
          newArticle: true,
          newVideo: true,
          activity: true,
          checkin: true
        }
      }
    });
  } catch (error) {
    console.error('获取通知设置错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 更新通知设置
const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.userId;
    const { settings } = req.body;
    
    if (!settings) {
      return res.status(400).json({
        success: false,
        message: '请提供设置信息'
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
    
    // 更新设置
    user.notificationSettings = {
      ...user.notificationSettings,
      ...settings
    };
    
    await user.save();
    
    res.json({
      success: true,
      message: '设置已更新'
    });
  } catch (error) {
    console.error('更新通知设置错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 创建会员方案
const createMemberPlan = async (req, res) => {
  try {
    const { name, price, originalPrice, period, periodDays, features, recommended, order } = req.body;
    
    // 验证请求字段
    if (!name || !price || !period || !periodDays) {
      return res.status(400).json({
        success: false,
        message: '请提供方案名称、价格、时长和天数'
      });
    }
    
    // 创建会员方案
    const plan = new MemberPlan({
      name,
      price,
      originalPrice,
      period,
      periodDays,
      features: features || [],
      recommended: recommended || false,
      order: order || 0
    });
    
    await plan.save();
    
    res.status(201).json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('创建会员方案错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 创建二维码
const createQRCode = async (req, res) => {
  try {
    const { type, title, description, imageUrl } = req.body;
    
    // 验证请求字段
    if (!type || !title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: '请提供类型、标题和图片URL'
      });
    }
    
    // 创建二维码
    const qrCode = new QRCode({
      type,
      title,
      description,
      imageUrl,
      createdBy: req.userId
    });
    
    await qrCode.save();
    
    res.status(201).json({
      success: true,
      data: qrCode
    });
  } catch (error) {
    console.error('创建二维码错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 创建会员宣传A4
const createMemberPromotion = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    
    // 验证请求字段
    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: '请提供标题和图片URL'
      });
    }
    
    // 创建会员宣传A4
    const promotion = new A4Content({
      type: 'member',
      category: 'promotion',
      title,
      description,
      imageUrl,
      createdBy: req.userId
    });
    
    await promotion.save();
    
    res.status(201).json({
      success: true,
      data: promotion
    });
  } catch (error) {
    console.error('创建会员宣传错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 获取所有会员方案
const getAllMemberPlans = async (req, res) => {
  try {
    const plans = await MemberPlan.find().sort({ order: 1 });
    
    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('获取所有会员方案错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 获取所有二维码
const getAllQRCodes = async (req, res) => {
  try {
    const qrCodes = await QRCode.find().sort({ type: 1 });
    
    res.json({
      success: true,
      data: qrCodes
    });
  } catch (error) {
    console.error('获取所有二维码错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 更新会员方案
const updateMemberPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, originalPrice, period, periodDays, features, recommended, order, isActive } = req.body;
    
    const plan = await MemberPlan.findById(id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: '会员方案不存在'
      });
    }
    
    // 更新字段
    if (name) plan.name = name;
    if (price !== undefined) plan.price = price;
    if (originalPrice !== undefined) plan.originalPrice = originalPrice;
    if (period) plan.period = period;
    if (periodDays !== undefined) plan.periodDays = periodDays;
    if (features) plan.features = features;
    if (recommended !== undefined) plan.recommended = recommended;
    if (order !== undefined) plan.order = order;
    if (isActive !== undefined) plan.isActive = isActive;
    
    await plan.save();
    
    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('更新会员方案错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 更新二维码
const updateQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, description, imageUrl, isActive } = req.body;
    
    const qrCode = await QRCode.findById(id);
    
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: '二维码不存在'
      });
    }
    
    // 更新字段
    if (type) qrCode.type = type;
    if (title) qrCode.title = title;
    if (description !== undefined) qrCode.description = description;
    if (imageUrl) qrCode.imageUrl = imageUrl;
    if (isActive !== undefined) qrCode.isActive = isActive;
    
    await qrCode.save();
    
    res.json({
      success: true,
      data: qrCode
    });
  } catch (error) {
    console.error('更新二维码错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 删除会员方案
const deleteMemberPlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await MemberPlan.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: '会员方案不存在'
      });
    }
    
    res.json({
      success: true,
      message: '会员方案已删除'
    });
  } catch (error) {
    console.error('删除会员方案错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 删除二维码
const deleteQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await QRCode.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: '二维码不存在'
      });
    }
    
    res.json({
      success: true,
      message: '二维码已删除'
    });
  } catch (error) {
    console.error('删除二维码错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

module.exports = {
  getQRCode,
  getMemberPromotion,
  getMemberPlans,
  getUserProfile,
  updateUserProfile,
  getMemberInfo,
  getNotificationSettings,
  updateNotificationSettings,
  createMemberPlan,
  createQRCode,
  createMemberPromotion,
  getAllMemberPlans,
  getAllQRCodes,
  updateMemberPlan,
  updateQRCode,
  deleteMemberPlan,
  deleteQRCode
}; 