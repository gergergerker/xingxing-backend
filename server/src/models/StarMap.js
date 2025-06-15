const mongoose = require('mongoose');

const starMapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['星图', '星宿卡片', '星宿详情', '星宿功能', '星象表达'],
    required: true
  },
  category: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    stars: [String],
    mythology: String,
    expressionType: {
      type: String,
      enum: ['文学', '占星', '神话']
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// 索引优化查询性能
starMapSchema.index({ type: 1, category: 1 });

const StarMap = mongoose.model('StarMap', starMapSchema);

module.exports = StarMap; 