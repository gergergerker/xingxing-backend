/**
 * 重置管理员密码脚本
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./server/src/config/config');

// 连接到MongoDB
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB 连接成功'))
.catch(err => {
  console.error('MongoDB 连接错误:', err);
  process.exit(1);
});

// 加载用户模型
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  nickName: String
});

const User = mongoose.model('User', userSchema);

async function resetAdmin() {
  try {
    // 查找超级管理员
    const admin = await User.findOne({ role: 'superadmin' });
    
    if (!admin) {
      console.log('没有找到超级管理员账号，将创建一个新账号');
      
      // 创建新的超级管理员
      const password = 'Admin@123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newAdmin = new User({
        email: 'admin@xiaoshijie.com',
        password: hashedPassword,
        role: 'superadmin',
        nickName: '晓视界超级管理员'
      });
      
      await newAdmin.save();
      console.log('超级管理员创建成功:');
      console.log('邮箱: admin@xiaoshijie.com');
      console.log('密码: Admin@123');
    } else {
      console.log('找到超级管理员账号，将重置密码');
      
      // 重置密码
      const password = 'Admin@123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      admin.password = hashedPassword;
      await admin.save();
      
      console.log('超级管理员密码重置成功:');
      console.log('邮箱:', admin.email);
      console.log('密码: Admin@123');
    }
    
    // 显示所有用户
    const users = await User.find({});
    console.log('\n系统中的所有用户:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });
  } catch (error) {
    console.error('重置超级管理员出错:', error);
  } finally {
    // 断开数据库连接
    mongoose.disconnect();
  }
}

// 执行重置
resetAdmin(); 