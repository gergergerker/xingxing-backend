const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['客服', '公众号', '小程序'],
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
  imageUrl: {
    type: String,
    required: true
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

const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode; 