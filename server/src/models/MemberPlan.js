const mongoose = require('mongoose');

const memberPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  period: {
    type: String,
    required: true,
    trim: true
  },
  periodDays: {
    type: Number,
    required: true
  },
  features: [{
    type: String,
    trim: true
  }],
  recommended: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const MemberPlan = mongoose.model('MemberPlan', memberPlanSchema);

module.exports = MemberPlan; 