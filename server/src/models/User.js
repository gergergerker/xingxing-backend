const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const userSchema = new mongoose.Schema({
  openId: {
    type: String,
    unique: true,
    sparse: true
  },
  unionId: {
    type: String,
    sparse: true
  },
  nickName: {
    type: String,
    trim: true
  },
  avatarUrl: {
    type: String
  },
  phone: {
    type: String,
    sparse: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true
  },
  password: {
    type: String,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },
  tags: [String],
  memberLevel: {
    type: Number,
    default: 0
  },
  expireDate: {
    type: Date
  },
  learningGoal: {
    type: String
  },
  checkinDays: {
    type: Number,
    default: 0
  },
  continuousDays: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  notificationSettings: {
    newArticle: { type: Boolean, default: true },
    newVideo: { type: Boolean, default: true },
    activity: { type: Boolean, default: true },
    checkin: { type: Boolean, default: true }
  },
  lastCheckinDate: {
    type: Date
  }
}, { timestamps: true });

// 保存前密码加密
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// 验证密码
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 生成JWT
userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ 
    id: this._id,
    role: this.role
  }, config.jwtSecret, { 
    expiresIn: config.jwtExpiresIn 
  });
};

// 确认用户是否是会员
userSchema.methods.isMember = function() {
  return this.memberLevel > 0 && this.expireDate && new Date(this.expireDate) > new Date();
};

const User = mongoose.model('User', userSchema);

module.exports = User; 