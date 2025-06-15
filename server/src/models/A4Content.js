const mongoose = require('mongoose');

const a4ContentSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['star', 'observe', 'sky', 'explore', 'member'],
    required: true
  },
  subtype: {
    type: String,
    trim: true
  },
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
  pdfUrl: {
    type: String
  },
  audioUrl: {
    type: String
  },
  order: {
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
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

// 索引优化查询性能
a4ContentSchema.index({ type: 1, category: 1, subtype: 1 });

const A4Content = mongoose.model('A4Content', a4ContentSchema);

module.exports = A4Content; 