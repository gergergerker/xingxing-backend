const A4Content = require('../models/A4Content');
const fs = require('fs');
const path = require('path');

// 获取北斗七星A4页面
const getBeiDouA4Content = async (req, res) => {
  try {
    const { star } = req.query;
    
    // 验证参数
    if (!star || !['天枢', '天璇', '天玑', '天权', '玉衡', '开阳', '瑶光'].includes(star)) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的星名：天枢/天璇/天玑/天权/玉衡/开阳/瑶光'
      });
    }
    
    // 查询A4内容
    const content = await A4Content.findOne({ 
      type: 'observe',
      category: 'beidou',
      subtype: star,
      isActive: true
    });
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: `未找到${star}星的A4内容`
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
    console.error('获取北斗七星A4内容错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取朗读音频
const getAudio = async (req, res) => {
  try {
    const { star } = req.query;
    
    // 验证参数
    if (!star || !['天枢', '天璇', '天玑', '天权', '玉衡', '开阳', '瑶光'].includes(star)) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的星名：天枢/天璇/天玑/天权/玉衡/开阳/瑶光'
      });
    }
    
    // 查询朗读音频
    const content = await A4Content.findOne({ 
      type: 'observe',
      category: 'beidou',
      subtype: star,
      isActive: true
    });
    
    if (!content || !content.audioUrl) {
      return res.status(404).json({
        success: false,
        message: `未找到${star}星的朗读音频`
      });
    }
    
    res.json({
      success: true,
      data: {
        audioUrl: content.audioUrl,
        duration: content.metadata?.duration || 60,
        title: `${star}星介绍`
      }
    });
  } catch (error) {
    console.error('获取朗读音频错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 创建北斗七星A4内容
const createBeiDouContent = async (req, res) => {
  try {
    const { star, title, description, imageUrl, pdfUrl, audioUrl, duration } = req.body;
    
    // 验证请求字段
    if (!star || !title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: '请提供星名、标题和图片URL'
      });
    }
    
    // 验证星名
    if (!['天枢', '天璇', '天玑', '天权', '玉衡', '开阳', '瑶光'].includes(star)) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的星名：天枢/天璇/天玑/天权/玉衡/开阳/瑶光'
      });
    }
    
    // 创建A4内容
    const content = new A4Content({
      type: 'observe',
      category: 'beidou',
      subtype: star,
      title,
      description,
      imageUrl,
      pdfUrl,
      audioUrl,
      metadata: {
        duration: duration || 60
      },
      createdBy: req.userId
    });
    
    await content.save();
    
    res.status(201).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('创建北斗七星A4内容错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 获取所有北斗七星A4内容
const getAllBeiDouContents = async (req, res) => {
  try {
    const contents = await A4Content.find({ 
      type: 'observe',
      category: 'beidou'
    }).sort({ subtype: 1 });
    
    res.json({
      success: true,
      data: contents
    });
  } catch (error) {
    console.error('获取所有北斗七星A4内容错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 更新北斗七星A4内容
const updateBeiDouContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { star, title, description, imageUrl, pdfUrl, audioUrl, duration, isActive } = req.body;
    
    const content = await A4Content.findById(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'A4内容不存在'
      });
    }
    
    // 验证星名
    if (star && !['天枢', '天璇', '天玑', '天权', '玉衡', '开阳', '瑶光'].includes(star)) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的星名：天枢/天璇/天玑/天权/玉衡/开阳/瑶光'
      });
    }
    
    // 更新字段
    if (star) content.subtype = star;
    if (title) content.title = title;
    if (description !== undefined) content.description = description;
    if (imageUrl) content.imageUrl = imageUrl;
    if (pdfUrl !== undefined) content.pdfUrl = pdfUrl;
    if (audioUrl !== undefined) content.audioUrl = audioUrl;
    if (duration !== undefined) content.metadata = { ...content.metadata, duration };
    if (isActive !== undefined) content.isActive = isActive;
    
    await content.save();
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('更新北斗七星A4内容错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 删除北斗七星A4内容
const deleteBeiDouContent = async (req, res) => {
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
    console.error('删除北斗七星A4内容错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

module.exports = {
  getBeiDouA4Content,
  getAudio,
  createBeiDouContent,
  getAllBeiDouContents,
  updateBeiDouContent,
  deleteBeiDouContent
}; 