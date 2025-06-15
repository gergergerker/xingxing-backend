# 🌟 星星项目后端 (Xingxing Backend)

> ⚠️ **开发分支说明**: 当前为 `develop` 分支，包含正在开发中的新功能，可能不稳定！
> 
> 🔥 **新功能预览**:
> - 用户头像上传功能 (开发中)
> - 实时消息推送 (测试中)  
> - Redis缓存优化 (开发中)
> - 邮件验证功能 (已完成)
>
> 📋 查看详细开发进度: [DEVELOP_FEATURES.md](./DEVELOP_FEATURES.md)
>
> 🚀 **生产环境请使用 `main` 分支**

## 📖 项目简介

星星项目后端是一个基于Node.js的现代化Web应用后端服务，提供完整的用户认证、数据管理和API接口服务。

## 🚀 技术栈

- **运行环境**: Node.js
- **框架**: Express.js
- **数据库**: MongoDB/MySQL
- **认证**: JWT Token
- **文件上传**: Multer
- **环境管理**: dotenv
- **缓存**: Redis (开发中)
- **实时通信**: Socket.io (开发中)

## 功能特点

- 提供完整小程序API接口
- 用户认证和权限控制
- 文件上传和管理
- 内容管理系统
- 会员系统
- 统计数据分析

## 技术栈

- **后端框架**
  - Node.js (v18+)
  - Express.js (v4+)
  - MongoDB (v6+)
  - Mongoose (ODM)

- **认证与安全**
  - JWT (JSON Web Tokens)
  - bcrypt (密码加密)
  - helmet (安全中间件)
  - cors (跨域资源共享)

- **文件处理**
  - multer (文件上传)
  - sharp (图片处理)

- **开发工具**
  - ESLint (代码规范)
  - Prettier (代码格式化)
  - nodemon (开发热重载)
  - dotenv (环境变量管理)

- **API文档**
  - Swagger/OpenAPI
  - Postman (API测试)

- **部署与运维**
  - PM2 (进程管理)
  - Docker (容器化)
  - Nginx (反向代理)

## 目录结构

```
├── server/
│   ├── src/
│   │   ├── api/            # API路由定义
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 数据模型
│   │   ├── middlewares/    # 中间件
│   │   ├── services/       # 服务层
│   │   ├── utils/          # 工具函数
│   │   ├── config/         # 配置文件
│   │   ├── app.js          # Express应用
│   │   └── server.js       # 服务器入口
│   └── ...
├── uploads/                # 上传文件目录
├── admin/                  # 后台管理系统前端
├── .env                    # 环境变量
├── package.json
└── README.md
```

## API模块

系统包含以下主要API模块：

1. **认证和用户管理**
   - 登录、注册、微信登录
   - 用户信息管理

2. **星河页面 (Star)**
   - 太空地图视频
   - 宇宙知识A4页面

3. **观测页面 (Observe)**
   - 北斗七星A4页面
   - 朗读音频

4. **星空页面 (Sky)**
   - 华夏星空星图
   - 28星宿卡片
   - 星宿功能
   - 星象表达

5. **探索页面 (Explore)**
   - 天文文章
   - 宇宙小剧场视频

6. **个人中心 (Profile)**
   - 客服二维码
   - 会员宣传页
   - 会员方案价格

## 部署环境要求

### 系统要求
- **操作系统**: Linux (推荐 Ubuntu 20.04+) / macOS / Windows
- **CPU**: 2核心以上
- **内存**: 4GB以上 (推荐8GB)
- **存储**: 20GB以上可用空间

### 软件环境
- **Node.js**: v18.0.0 或更高版本
- **npm**: v8.0.0 或更高版本 (或 yarn v1.22.0+)
- **MongoDB**: v6.0 或更高版本
- **Redis**: v6.0+ (可选，用于缓存和会话存储)

### 网络要求
- **端口**: 需要开放3000端口 (或自定义端口)
- **域名**: 生产环境建议配置域名和SSL证书
- **带宽**: 建议10Mbps以上

### 第三方服务
- **微信小程序**: 需要微信小程序AppID和AppSecret
- **文件存储**: 支持本地存储或云存储 (阿里云OSS/腾讯云COS)
- **短信服务**: 可选配置短信验证码服务

## 安装和运行

1. 克隆项目
   ```
   git clone <项目地址>
   cd 星星后端
   ```

2. 安装依赖
   ```
   npm install
   ```

3. 配置环境变量
   - 复制`.env.example`为`.env`
   - 根据实际情况修改配置

4. 启动开发服务器
   ```
   npm run dev
   ```

5. 生产环境部署
   ```
   npm run build
   npm start
   ```

## 初始化管理员账户

首次部署后，请执行以下操作初始化超级管理员账户：

```
POST /api/v1/admin/init
```

默认管理员账户信息：
- 邮箱: admin@xiaoshijie.com
- 密码: admin@2023

## API文档

完整API文档请参见 [api.md](api.md) 文件。

## 开发团队

- XXX - 项目负责人
- XXX - 后端开发
- XXX - 前端开发

## 许可证

本项目采用 [MIT 许可证](LICENSE)
