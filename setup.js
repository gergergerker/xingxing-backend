const fs = require('fs');
const path = require('path');

// 要创建的目录
const directories = [
  'server/uploads',
  'server/uploads/avatars',
  'server/uploads/qrcodes',
  'server/uploads/articles',
  'server/uploads/videos',
  'server/uploads/starmap',
  'server/logs'
];

// 要创建的.gitkeep文件（保持空目录）
const gitkeepFiles = directories.map(dir => path.join(dir, '.gitkeep'));

// 创建目录
console.log('正在创建项目目录结构...');
directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ 创建目录: ${dir}`);
  } else {
    console.log(`! 目录已存在: ${dir}`);
  }
});

// 创建.gitkeep文件
gitkeepFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
    console.log(`✓ 创建文件: ${file}`);
  } else {
    console.log(`! 文件已存在: ${file}`);
  }
});

// 环境变量文件
if (!fs.existsSync(path.join(__dirname, '.env'))) {
  try {
    fs.copyFileSync(
      path.join(__dirname, '.env.example'),
      path.join(__dirname, '.env')
    );
    console.log('✓ 已创建 .env 文件 (从 .env.example 复制)');
  } catch (err) {
    console.error('! 无法创建 .env 文件:', err.message);
  }
} else {
  console.log('! .env 文件已存在');
}

console.log('\n项目初始化完成！');
console.log('使用以下命令启动项目:');
console.log(' npm run dev     # 开发模式');
console.log(' npm start       # 生产模式'); 