const StarVideo = require('../models/StarVideo');
const A4Content = require('../models/A4Content');

// 获取太空地图视频
const getVideoByType = async (req, res) => {
  try {
    const { type } = req.query;
    
    // 验证类型
    if (!type || !['宇宙', '星系', '天体', '地球'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的视频类型：宇宙/星系/天体/地球'
      });
    }
    
    // 查询视频
    const video = await StarVideo.findOne({ 
      type, 
      isActive: true 
    }).sort({ order: 1 });
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: `未找到${type}类型的视频`
      });
    }
    
    res.json({
      success: true,
      data: {
        videoUrl: video.videoUrl,
        title: video.title,
        duration: video.duration,
        coverUrl: video.coverUrl,
        description: video.description
      }
    });
  } catch (error) {
    console.error('获取视频错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取宇宙知识A4页面
const getA4Content = async (req, res) => {
  try {
    const { category } = req.query;
    
    // 验证类别
    if (!category || !['宇宙结构', '天体类型', '能量与场', '我们在哪'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的类别：宇宙结构/天体类型/能量与场/我们在哪'
      });
    }
    
    // 查询A4内容
    const content = await A4Content.findOne({ 
      type: 'star', 
      category,
      isActive: true 
    });
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: `未找到${category}类别的A4内容`
      });
    }
    
    res.json({
      success: true,
      data: {
        imageUrl: content.imageUrl,
        title: content.title,
        description: content.description,
        pdfUrl: content.pdfUrl
      }
    });
  } catch (error) {
    console.error('获取A4内容错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 创建新视频
const createVideo = async (req, res) => {
  try {
    const { type, title, description, videoUrl, coverUrl, duration } = req.body;
    
    // 验证请求字段
    if (!type || !title || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: '请提供视频类型、标题和URL'
      });
    }
    
    // 创建视频
    const video = new StarVideo({
      type,
      title,
      description,
      videoUrl,
      coverUrl,
      duration: duration || 0,
      createdBy: req.userId
    });
    
    await video.save();
    
    res.status(201).json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('创建视频错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 创建新A4内容
const createA4Content = async (req, res) => {
  try {
    const { category, title, description, imageUrl, pdfUrl } = req.body;
    
    // 验证请求字段
    if (!category || !title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: '请提供内容类别、标题和图片URL'
      });
    }
    
    // 创建A4内容
    const content = new A4Content({
      type: 'star',
      category,
      title,
      description,
      imageUrl,
      pdfUrl,
      createdBy: req.userId
    });
    
    await content.save();
    
    res.status(201).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('创建A4内容错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 获取所有视频
const getAllVideos = async (req, res) => {
  try {
    const videos = await StarVideo.find().sort({ type: 1, order: 1 });
    
    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('获取所有视频错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 获取所有A4内容
const getAllA4Contents = async (req, res) => {
  try {
    const contents = await A4Content.find({ 
      type: 'star' 
    }).sort({ category: 1, order: 1 });
    
    res.json({
      success: true,
      data: contents
    });
  } catch (error) {
    console.error('获取所有A4内容错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 更新视频
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, description, videoUrl, coverUrl, duration, isActive } = req.body;
    
    const video = await StarVideo.findById(id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: '视频不存在'
      });
    }
    
    // 更新字段
    if (type) video.type = type;
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (videoUrl) video.videoUrl = videoUrl;
    if (coverUrl) video.coverUrl = coverUrl;
    if (duration !== undefined) video.duration = duration;
    if (isActive !== undefined) video.isActive = isActive;
    
    await video.save();
    
    res.json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('更新视频错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 更新A4内容
const updateA4Content = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, title, description, imageUrl, pdfUrl, isActive } = req.body;
    
    const content = await A4Content.findById(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'A4内容不存在'
      });
    }
    
    // 更新字段
    if (category) content.category = category;
    if (title) content.title = title;
    if (description !== undefined) content.description = description;
    if (imageUrl) content.imageUrl = imageUrl;
    if (pdfUrl !== undefined) content.pdfUrl = pdfUrl;
    if (isActive !== undefined) content.isActive = isActive;
    
    await content.save();
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('更新A4内容错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 删除视频
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await StarVideo.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: '视频不存在'
      });
    }
    
    res.json({
      success: true,
      message: '视频已删除'
    });
  } catch (error) {
    console.error('删除视频错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 删除A4内容
const deleteA4Content = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await A4Content.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'A4内容不存在'
      });
    }
    
    res.json({
      success: true,
      message: 'A4内容已删除'
    });
  } catch (error) {
    console.error('删除A4内容错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

module.exports = {
  getVideoByType,
  getA4Content,
  createVideo,
  createA4Content,
  getAllVideos,
  getAllA4Contents,
  updateVideo,
  updateA4Content,
  deleteVideo,
  deleteA4Content
}; 