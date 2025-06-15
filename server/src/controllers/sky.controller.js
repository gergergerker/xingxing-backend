const StarMap = require('../models/StarMap');

// 获取华夏星空星图
const getChineseStarMap = async (req, res) => {
  try {
    // 查询星图
    const starMap = await StarMap.findOne({ 
      type: '星图',
      category: '华夏星空',
      isActive: true
    });
    
    if (!starMap) {
      return res.status(404).json({
        success: false,
        message: '未找到华夏星空星图'
      });
    }
    
    res.json({
      success: true,
      data: {
        imageUrl: starMap.imageUrl,
        description: starMap.description,
        title: starMap.title
      }
    });
  } catch (error) {
    console.error('获取华夏星空星图错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取28星宿卡片
const getXingXiuCards = async (req, res) => {
  try {
    // 查询星宿卡片
    const cards = await StarMap.find({ 
      type: '星宿卡片',
      isActive: true
    }).sort({ order: 1 });
    
    if (!cards || cards.length === 0) {
      return res.status(404).json({
        success: false,
        message: '未找到星宿卡片'
      });
    }
    
    const formattedCards = cards.map(card => ({
      id: card._id,
      name: card.title,
      coverUrl: card.imageUrl,
      description: card.description
    }));
    
    res.json({
      success: true,
      data: {
        cards: formattedCards
      }
    });
  } catch (error) {
    console.error('获取星宿卡片错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取星宿详情
const getXingXiuDetail = async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '请提供星宿ID'
      });
    }
    
    // 查询星宿详情
    const detail = await StarMap.findOne({ 
      _id: id,
      type: '星宿卡片',
      isActive: true
    });
    
    if (!detail) {
      return res.status(404).json({
        success: false,
        message: '未找到星宿详情'
      });
    }
    
    // 查询相关的详情页
    const detailPages = await StarMap.find({
      type: '星宿详情',
      category: detail.title, // 使用卡片的标题作为详情页的分类
      isActive: true
    }).sort({ order: 1 });
    
    res.json({
      success: true,
      data: {
        name: detail.title,
        description: detail.description,
        stars: detail.metadata?.stars || [],
        mythology: detail.metadata?.mythology || '',
        pages: detailPages.map(page => ({
          imageUrl: page.imageUrl,
          title: page.title,
          description: page.description
        }))
      }
    });
  } catch (error) {
    console.error('获取星宿详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取星宿功能
const getXingXiuFunctions = async (req, res) => {
  try {
    // 查询星宿功能
    const functions = await StarMap.find({ 
      type: '星宿功能',
      isActive: true
    }).sort({ order: 1 });
    
    if (!functions || functions.length === 0) {
      return res.status(404).json({
        success: false,
        message: '未找到星宿功能'
      });
    }
    
    const formattedFunctions = functions.map(func => ({
      id: func._id,
      title: func.title,
      imageUrl: func.imageUrl,
      description: func.description
    }));
    
    res.json({
      success: true,
      data: {
        images: formattedFunctions
      }
    });
  } catch (error) {
    console.error('获取星宿功能错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取星象表达
const getStarExpressions = async (req, res) => {
  try {
    const { type } = req.query;
    
    // 验证类型
    if (!type || !['文学', '占星', '神话'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的类型：文学/占星/神话'
      });
    }
    
    // 查询星象表达
    const expressions = await StarMap.find({ 
      type: '星象表达',
      'metadata.expressionType': type,
      isActive: true
    }).sort({ order: 1 });
    
    if (!expressions || expressions.length === 0) {
      return res.status(404).json({
        success: false,
        message: `未找到类型为${type}的星象表达`
      });
    }
    
    const formattedExpressions = expressions.map(expr => ({
      id: expr._id,
      title: expr.title,
      imageUrl: expr.imageUrl,
      description: expr.description
    }));
    
    res.json({
      success: true,
      data: {
        images: formattedExpressions
      }
    });
  } catch (error) {
    console.error('获取星象表达错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 创建星图
const createStarMap = async (req, res) => {
  try {
    const { type, category, title, description, imageUrl, stars, mythology, expressionType, order } = req.body;
    
    // 验证请求字段
    if (!type || !title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: '请提供类型、标题和图片URL'
      });
    }
    
    // 创建元数据
    const metadata = {};
    
    if (stars) metadata.stars = stars;
    if (mythology) metadata.mythology = mythology;
    if (expressionType) metadata.expressionType = expressionType;
    
    // 创建星图
    const starMap = new StarMap({
      type,
      category,
      title,
      description,
      imageUrl,
      metadata,
      order: order || 0,
      createdBy: req.userId
    });
    
    await starMap.save();
    
    res.status(201).json({
      success: true,
      data: starMap
    });
  } catch (error) {
    console.error('创建星图错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 获取所有星图
const getAllStarMaps = async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = {};
    
    if (type) {
      query.type = type;
    }
    
    const starMaps = await StarMap.find(query).sort({ type: 1, category: 1, order: 1 });
    
    res.json({
      success: true,
      data: starMaps
    });
  } catch (error) {
    console.error('获取所有星图错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 更新星图
const updateStarMap = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, category, title, description, imageUrl, stars, mythology, expressionType, order, isActive } = req.body;
    
    const starMap = await StarMap.findById(id);
    
    if (!starMap) {
      return res.status(404).json({
        success: false,
        message: '星图不存在'
      });
    }
    
    // 更新字段
    if (type) starMap.type = type;
    if (category !== undefined) starMap.category = category;
    if (title) starMap.title = title;
    if (description !== undefined) starMap.description = description;
    if (imageUrl) starMap.imageUrl = imageUrl;
    if (order !== undefined) starMap.order = order;
    if (isActive !== undefined) starMap.isActive = isActive;
    
    // 更新元数据
    starMap.metadata = starMap.metadata || {};
    
    if (stars !== undefined) starMap.metadata.stars = stars;
    if (mythology !== undefined) starMap.metadata.mythology = mythology;
    if (expressionType !== undefined) starMap.metadata.expressionType = expressionType;
    
    await starMap.save();
    
    res.json({
      success: true,
      data: starMap
    });
  } catch (error) {
    console.error('更新星图错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 删除星图
const deleteStarMap = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await StarMap.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: '星图不存在'
      });
    }
    
    res.json({
      success: true,
      message: '星图已删除'
    });
  } catch (error) {
    console.error('删除星图错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

module.exports = {
  getChineseStarMap,
  getXingXiuCards,
  getXingXiuDetail,
  getXingXiuFunctions,
  getStarExpressions,
  createStarMap,
  getAllStarMaps,
  updateStarMap,
  deleteStarMap
}; 