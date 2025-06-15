const Article = require('../models/Article');
const Video = require('../models/Video');

// 获取文章列表
const getArticles = async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    
    // 验证参数
    if (type && !['天文时事', '天文回顾'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: '类型参数无效，有效值为：天文时事/天文回顾'
      });
    }
    
    // 构建查询条件
    const query = { isActive: true };
    if (type) query.type = type;
    
    // 查询文章总数
    const total = await Article.countDocuments(query);
    
    // 分页查询文章
    const articles = await Article.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('title coverUrl tags date audioUrl');
    
    // 格式化响应数据
    const formattedArticles = articles.map(article => ({
      id: article._id,
      title: article.title,
      coverUrl: article.coverUrl,
      tags: article.tags,
      date: article.date,
      hasAudio: !!article.audioUrl
    }));
    
    res.json({
      success: true,
      data: {
        articles: formattedArticles,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('获取文章列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取文章详情
const getArticleDetail = async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '请提供文章ID'
      });
    }
    
    // 查询文章
    const article = await Article.findOne({ 
      _id: id,
      isActive: true
    });
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }
    
    // 更新浏览量
    article.views += 1;
    await article.save();
    
    res.json({
      success: true,
      data: {
        id: article._id,
        title: article.title,
        content: article.content,
        author: article.author,
        date: article.date,
        images: article.images,
        textBoxes: article.textBoxes,
        audioUrl: article.audioUrl,
        printUrl: article.printUrl,
        tags: article.tags,
        type: article.type
      }
    });
  } catch (error) {
    console.error('获取文章详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取文章音频
const getArticleAudio = async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '请提供文章ID'
      });
    }
    
    // 查询文章
    const article = await Article.findOne({ 
      _id: id,
      isActive: true
    });
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }
    
    if (!article.audioUrl) {
      return res.status(404).json({
        success: false,
        message: '该文章没有音频'
      });
    }
    
    res.json({
      success: true,
      data: {
        audioUrl: article.audioUrl,
        title: article.title
      }
    });
  } catch (error) {
    console.error('获取文章音频错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取文章打印页
const getArticlePrint = async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '请提供文章ID'
      });
    }
    
    // 查询文章
    const article = await Article.findOne({ 
      _id: id,
      isActive: true
    });
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }
    
    if (!article.printUrl) {
      return res.status(404).json({
        success: false,
        message: '该文章没有打印页'
      });
    }
    
    res.json({
      success: true,
      data: {
        imageUrl: article.printUrl,
        title: article.title,
        pdfUrl: article.printUrl
      }
    });
  } catch (error) {
    console.error('获取文章打印页错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取文章习题
const getArticleExercises = async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '请提供文章ID'
      });
    }
    
    // 查询文章
    const article = await Article.findOne({ 
      _id: id,
      isActive: true
    });
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }
    
    if (!article.exercises || article.exercises.length === 0) {
      return res.status(404).json({
        success: false,
        message: '该文章没有习题'
      });
    }
    
    // 不返回正确答案，只返回问题和选项
    const exercises = article.exercises.map(exercise => ({
      id: exercise._id,
      question: exercise.question,
      options: exercise.options
    }));
    
    res.json({
      success: true,
      data: {
        exercises
      }
    });
  } catch (error) {
    console.error('获取文章习题错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 提交习题答案
const submitExerciseAnswer = async (req, res) => {
  try {
    const { exerciseId, answer } = req.body;
    const articleId = req.query.id;
    
    if (!exerciseId || answer === undefined || !articleId) {
      return res.status(400).json({
        success: false,
        message: '请提供习题ID、答案和文章ID'
      });
    }
    
    // 查询文章
    const article = await Article.findOne({ _id: articleId, isActive: true });
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }
    
    // 查找习题
    const exercise = article.exercises.id(exerciseId);
    
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: '习题不存在'
      });
    }
    
    // 检查答案
    const isCorrect = exercise.correctAnswer === parseInt(answer);
    
    res.json({
      success: true,
      data: {
        isCorrect,
        explanation: exercise.explanation
      }
    });
  } catch (error) {
    console.error('提交习题答案错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取宇宙小剧场视频列表
const getVideos = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // 查询视频总数
    const total = await Video.countDocuments({ isActive: true });
    
    // 分页查询视频
    const videos = await Video.find({ isActive: true })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('title thumbnailUrl date duration');
    
    // 格式化响应数据
    const formattedVideos = videos.map(video => ({
      id: video._id,
      title: video.title,
      thumbnailUrl: video.thumbnailUrl,
      date: video.date,
      duration: video.duration
    }));
    
    res.json({
      success: true,
      data: {
        videos: formattedVideos,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('获取视频列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 获取视频详情
const getVideoDetail = async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '请提供视频ID'
      });
    }
    
    // 查询视频
    const video = await Video.findOne({ 
      _id: id,
      isActive: true
    });
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: '视频不存在'
      });
    }
    
    // 更新浏览量
    video.views += 1;
    await video.save();
    
    res.json({
      success: true,
      data: {
        id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl,
        date: video.date,
        duration: video.duration,
        tags: video.tags,
        views: video.views,
        likes: video.likes
      }
    });
  } catch (error) {
    console.error('获取视频详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 创建文章
const createArticle = async (req, res) => {
  try {
    const { 
      title, type, content, coverUrl, tags, 
      author, images, textBoxes, audioUrl, printUrl,
      exercises
    } = req.body;
    
    // 验证请求字段
    if (!title || !type || !content || !coverUrl) {
      return res.status(400).json({
        success: false,
        message: '请提供标题、类型、内容和封面URL'
      });
    }
    
    // 创建文章
    const article = new Article({
      title,
      type,
      content,
      coverUrl,
      tags: tags || [],
      author,
      images: images || [],
      textBoxes: textBoxes || [],
      audioUrl,
      printUrl,
      exercises: exercises || [],
      createdBy: req.userId
    });
    
    await article.save();
    
    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('创建文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 创建视频
const createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, duration, tags } = req.body;
    
    // 验证请求字段
    if (!title || !videoUrl || !thumbnailUrl) {
      return res.status(400).json({
        success: false,
        message: '请提供标题、视频URL和缩略图URL'
      });
    }
    
    // 创建视频
    const video = new Video({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration: duration || 0,
      tags: tags || [],
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

// 管理员: 获取所有文章
const getAllArticles = async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = {};
    
    if (type) {
      query.type = type;
    }
    
    const articles = await Article.find(query).sort({ date: -1 });
    
    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('获取所有文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 管理员: 获取所有视频
const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ date: -1 });
    
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

// 管理员: 更新文章
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, type, content, coverUrl, tags,
      author, images, textBoxes, audioUrl, printUrl,
      exercises, isActive
    } = req.body;
    
    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }
    
    // 更新字段
    if (title) article.title = title;
    if (type) article.type = type;
    if (content) article.content = content;
    if (coverUrl) article.coverUrl = coverUrl;
    if (tags) article.tags = tags;
    if (author !== undefined) article.author = author;
    if (images) article.images = images;
    if (textBoxes) article.textBoxes = textBoxes;
    if (audioUrl !== undefined) article.audioUrl = audioUrl;
    if (printUrl !== undefined) article.printUrl = printUrl;
    if (exercises) article.exercises = exercises;
    if (isActive !== undefined) article.isActive = isActive;
    
    await article.save();
    
    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('更新文章错误:', error);
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
    const { title, description, videoUrl, thumbnailUrl, duration, tags, isActive } = req.body;
    
    const video = await Video.findById(id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: '视频不存在'
      });
    }
    
    // 更新字段
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (videoUrl) video.videoUrl = videoUrl;
    if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;
    if (duration !== undefined) video.duration = duration;
    if (tags) video.tags = tags;
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

// 管理员: 删除文章
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Article.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }
    
    res.json({
      success: true,
      message: '文章已删除'
    });
  } catch (error) {
    console.error('删除文章错误:', error);
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
    
    const result = await Video.findByIdAndDelete(id);
    
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

module.exports = {
  getArticles,
  getArticleDetail,
  getArticleAudio,
  getArticlePrint,
  getArticleExercises,
  submitExerciseAnswer,
  getVideos,
  getVideoDetail,
  createArticle,
  createVideo,
  getAllArticles,
  getAllVideos,
  updateArticle,
  updateVideo,
  deleteArticle,
  deleteVideo
}; 