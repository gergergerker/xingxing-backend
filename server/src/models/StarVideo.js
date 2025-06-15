const mongoose = require('mongoose');

const starVideoSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['宇宙', '星系', '天体', '地球'],
    required: true
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
  videoUrl: {
    type: String,
    required: true
  },
  coverUrl: {
    type: String
  },
  duration: {
    type: Number,
    default: 0
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
  }
}, { timestamps: true });

const StarVideo = mongoose.model('StarVideo', starVideoSchema);

module.exports = StarVideo; 