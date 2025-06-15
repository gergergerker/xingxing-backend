# 🌟 星星项目后端 (Xingxing Backend)

## 📖 项目简介

星星项目后端是一个基于Node.js的现代化Web应用后端服务，提供完整的用户认证、数据管理和API接口服务。

## 🚀 技术栈

- **运行环境**: Node.js
- **框架**: Express.js
- **数据库**: MongoDB/MySQL
- **认证**: JWT Token
- **文件上传**: Multer
- **环境管理**: dotenv

## 📁 项目结构

```
星星后端_副本/
├── src/                    # 源代码目录
├── server/                 # 服务器配置
├── public/                 # 静态资源
├── uploads/                # 文件上传目录
├── node_modules/           # 依赖包
├── package.json            # 项目配置
├── .env                    # 环境变量
├── .env.example            # 环境变量示例
├── setup.js                # 项目初始化脚本
├── reset-admin.js          # 管理员重置脚本
└── README.md               # 项目说明文档
```

## 🛠️ 安装与运行

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/gergergerker/xingxing-backend.git
cd xingxing-backend
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

4. **初始化项目**
```bash
node setup.js
```

5. **启动服务**
```bash
npm start
```

## 🔧 开发模式

```bash
npm run dev
```

## 📚 API 文档

### 用户认证相关
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/profile` - 获取用户信息

### 数据管理相关
- `GET /api/data` - 获取数据列表
- `POST /api/data` - 创建新数据
- `PUT /api/data/:id` - 更新数据
- `DELETE /api/data/:id` - 删除数据

### 文件上传相关
- `POST /api/upload` - 文件上传
- `GET /api/files` - 获取文件列表

## 🌿 分支说明

- **main** - 生产环境稳定版本
- **develop** - 开发环境最新版本

## 🔐 环境变量配置

在 `.env` 文件中配置以下变量：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=27017
DB_NAME=xingxing

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

## 🧪 测试

```bash
npm test
```

## 📝 更新日志

- **v1.0.0** - 初始版本发布
- **v1.1.0** - 添加用户认证功能
- **v1.2.0** - 数据库优化和API改进

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目维护者: gergergerker
- GitHub: https://github.com/gergergerker
- 项目地址: https://github.com/gergergerker/xingxing-backend

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者们！
