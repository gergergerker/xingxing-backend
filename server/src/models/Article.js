const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['天文时事', '天文回顾'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  coverUrl: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String,
    trim: true
  },
  audioUrl: {
    type: String
  },
  printUrl: {
    type: String
  },
  exercises: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number,
      required: true
    },
    explanation: {
      type: String
    }
  }],
  textBoxes: [{
    title: {
      type: String
    },
    content: {
      type: String,
      required: true
    }
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// 索引优化查询性能
articleSchema.index({ type: 1, date: -1 });
articleSchema.index({ tags: 1 });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article; 