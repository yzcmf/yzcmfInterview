# 社交平台项目结构框架

## 📁 项目根目录结构

```
auto_project_1_friend_social_platform/
├── 📄 README.md                           # 项目主文档
├── 📄 package.json                        # 根项目配置
├── 📄 docker-compose.yml                  # 开发环境容器编排
├── 📄 .env.example                        # 环境变量示例
├── 📄 .gitignore                          # Git忽略文件
├── 📄 .dockerignore                       # Docker忽略文件
├── 📄 docker-compose.prod.yml             # 生产环境容器编排
├── 📄 docker-compose.staging.yml          # 测试环境容器编排
│
├── 📁 frontend/                           # 前端应用
│   ├── �� package.json
│   ├── 📄 next.config.js
│   ├── �� tailwind.config.js
│   ├── 📄 tsconfig.json
│   ├── 📄 .env.local
│   ├── 📁 public/
│   │   ├── �� images/
│   │   ├── 📁 icons/
│   │   └── 📄 favicon.ico
│   ├── 📁 src/
│   │   ├── 📁 app/                        # Next.js 13+ App Router
│   │   │   ├── 📁 (auth)/                 # 认证相关页面
│   │   │   │   ├── 📄 login/page.tsx
│   │   │   │   ├── 📄 register/page.tsx
│   │   │   │   └── 📄 layout.tsx
│   │   │   ├── 📁 (dashboard)/            # 主应用页面
│   │   │   │   ├── 📄 dashboard/page.tsx
│   │   │   │   ├── 📄 profile/page.tsx
│   │   │   │   ├── 📄 matches/page.tsx
│   │   │   │   ├── 📄 chat/page.tsx
│   │   │   │   └── 📄 layout.tsx
│   │   │   ├── 📁 api/                    # API路由
│   │   │   │   ├── 📄 auth/[...nextauth]/route.ts
│   │   │   │   ├── 📄 users/route.ts
│   │   │   │   └── 📄 matches/route.ts
│   │   │   ├── 📄 globals.css
│   │   │   ├── 📄 layout.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 components/                 # 可复用组件
│   │   │   ├── 📁 ui/                     # 基础UI组件
│   │   │   │   ├── 📄 Button.tsx
│   │   │   │   ├── 📄 Input.tsx
│   │   │   │   ├── 📄 Modal.tsx
│   │   │   │   └── 📄 Card.tsx
│   │   │   ├── 📁 auth/                   # 认证组件
│   │   │   │   ├── 📄 LoginForm.tsx
│   │   │   │   └── 📄 RegisterForm.tsx
│   │   │   ├── �� chat/                   # 聊天组件
│   │   │   │   ├── 📄 ChatWindow.tsx
│   │   │   │   ├── 📄 MessageList.tsx
│   │   │   │   └── 📄 MessageInput.tsx
│   │   │   ├── 📁 matching/               # 匹配组件
│   │   │   │   ├── 📄 UserCard.tsx
│   │   │   │   ├── 📄 MatchQueue.tsx
│   │   │   │   └── 📄 CompatibilityScore.tsx
│   │   │   └── 📁 profile/                # 个人资料组件
│   │   │       ├── 📄 ProfileForm.tsx
│   │   │       └── 📄 AvatarUpload.tsx
│   │   ├── 📁 hooks/                      # 自定义Hooks
│   │   │   ├── 📄 useAuth.ts
│   │   │   ├── 📄 useChat.ts
│   │   │   ├── 📄 useMatches.ts
│   │   │   └── 📄 useWebSocket.ts
│   │   ├── 📁 lib/                        # 工具库
│   │   │   ├── 📄 api.ts                  # API客户端
│   │   │   ├── 📄 auth.ts                 # 认证工具
│   │   │   ├── 📄 utils.ts                # 通用工具
│   │   │   └── 📄 constants.ts            # 常量定义
│   │   ├── 📁 types/                      # TypeScript类型定义
│   │   │   ├── 📄 user.ts
│   │   │   ├── 📄 match.ts
│   │   │   ├── 📄 chat.ts
│   │   │   └── 📄 api.ts
│   │   ├── 📁 store/                      # 状态管理
│   │   │   ├── 📄 authStore.ts
│   │   │   ├── 📄 chatStore.ts
│   │   │   └── 📄 matchStore.ts
│   │   └── 📁 styles/                     # 样式文件
│   │       ├── 📄 components.css
│   │       └── �� animations.css
│   ├── 📁 tests/                          # 前端测试
│   │   ├── 📁 __mocks__/
│   │   ├── 📁 components/
│   │   └── 📁 utils/
│   └── 📄 jest.config.js
│
├── 📁 mobile/                             # 移动端应用 (React Native)
│   ├── 📄 package.json
│   ├── 📄 metro.config.js
│   ├── 📄 babel.config.js
│   ├── 📄 app.json
│   ├── 📄 index.js
│   ├── 📁 android/                        # Android原生代码
│   │   ├── 📁 app/
│   │   ├── 📁 gradle/
│   │   └── 📄 build.gradle
│   ├── 📁 ios/                            # iOS原生代码
│   │   ├── 📁 SocialPlatform/
│   │   └── 📄 Podfile
│   ├── 📁 src/
│   │   ├── 📁 screens/                    # 页面组件
│   │   │   ├── 📄 AuthScreen.tsx
│   │   │   ├── 📄 HomeScreen.tsx
│   │   │   ├── 📄 ChatScreen.tsx
│   │   │   ├── 📄 MatchScreen.tsx
│   │   │   └── 📄 ProfileScreen.tsx
│   │   ├── 📁 components/                 # 移动端组件
│   │   │   ├── 📄 ChatBubble.tsx
│   │   │   ├── 📄 SwipeCard.tsx
│   │   │   └── 📄 NavigationBar.tsx
│   │   ├── 📁 navigation/                 # 导航配置
│   │   │   ├── 📄 AppNavigator.tsx
│   │   │   └── 📄 TabNavigator.tsx
│   │   ├── 📁 services/                   # 移动端服务
│   │   │   ├── 📄 api.ts
│   │   │   ├── �� pushNotifications.ts
│   │   │   └── 📄 location.ts
│   │   └── 📁 utils/                      # 移动端工具
│   │       ├── 📄 permissions.ts
│   │       └── 📄 device.ts
│   └── 📁 __tests__/                      # 移动端测试
│
├── 📁 backend/                            # 后端服务
│   ├── 📄 package.json                    # Node.js主服务
│   ├── 📄 tsconfig.json
│   ├── 📄 .env
│   ├── 📄 server.ts                       # 服务器入口
│   ├── 📁 src/
│   │   ├── 📁 controllers/                # 控制器层
│   │   │   ├── 📄 authController.ts
│   │   │   ├── 📄 userController.ts
│   │   │   ├── 📄 matchController.ts
│   │   │   ├── 📄 chatController.ts
│   │   │   └── 📄 analyticsController.ts
│   │   ├── 📁 services/                   # 业务逻辑层
│   │   │   ├── 📄 authService.ts
│   │   │   ├── 📄 userService.ts
│   │   │   ├── 📄 matchService.ts
│   │   │   ├── 📄 chatService.ts
│   │   │   ├── 📄 notificationService.ts
│   │   │   └── 📄 analyticsService.ts
│   │   ├── 📁 models/                     # 数据模型
│   │   │   ├── 📄 User.ts
│   │   │   ├── 📄 Match.ts
│   │   │   ├── 📄 Message.ts
│   │   │   ├── 📄 UserActivity.ts
│   │   │   └── 📄 UserTag.ts
│   │   ├── 📁 routes/                     # 路由定义
│   │   │   ├── 📄 auth.ts
│   │   │   ├── 📄 users.ts
│   │   │   ├── 📄 matches.ts
│   │   │   ├── 📄 chat.ts
│   │   │   └── 📄 analytics.ts
│   │   ├── 📁 middleware/                 # 中间件
│   │   │   ├── 📄 auth.ts
│   │   │   ├── 📄 validation.ts
│   │   │   ├── 📄 rateLimit.ts
│   │   │   ├── 📄 cors.ts
│   │   │   └── 📄 errorHandler.ts
│   │   ├── 📁 utils/                      # 工具函数
│   │   │   ├── 📄 database.ts
│   │   │   ├── 📄 redis.ts
│   │   │   ├── 📄 jwt.ts
│   │   │   ├── 📄 validation.ts
│   │   │   └── 📄 logger.ts
│   │   ├── 📁 types/                      # TypeScript类型
│   │   │   ├── 📄 user.ts
│   │   │   ├── 📄 match.ts
│   │   │   └── 📄 api.ts
│   │   └── 📁 config/                     # 配置文件
│   │       ├── 📄 database.ts
│   │       ├── 📄 redis.ts
│   │       └── 📄 app.ts
│   ├── 📁 tests/                          # 后端测试
│   │   ├── 📁 unit/
│   │   ├── 📁 integration/
│   │   └── 📁 e2e/
│   └── 📄 jest.config.js
│
├── 📁 ai-service/                         # AI微服务 (Python)
│   ├── 📄 requirements.txt
│   ├── 📄 Dockerfile
│   ├── 📄 app.py                          # FastAPI应用入口
│   ├── 📄 config.py                       # 配置文件
│   ├── 📁 src/
│   │   ├── 📁 models/                     # AI模型
│   │   │   ├── 📄 matching_model.py       # 匹配算法模型
│   │   │   ├── 📄 nlp_model.py           # NLP处理模型
│   │   │   ├── 📄 image_model.py         # 图像处理模型
│   │   │   └── 📄 recommendation.py      # 推荐系统
│   │   ├── 📁 services/                   # AI服务
│   │   │   ├── 📄 matching_service.py
│   │   │   ├── 📄 content_moderation.py
│   │   │   ├── 📄 user_embedding.py
│   │   │   └── 📄 similarity_calculator.py
│   │   ├── 📁 api/                        # API路由
│   │   │   ├── 📄 matching.py
│   │   │   ├── 📄 moderation.py
│   │   │   └── 📄 embeddings.py
│   │   ├── 📁 utils/                      # 工具函数
│   │   │   ├── 📄 preprocessor.py
│   │   │   ├── 📄 feature_extractor.py
│   │   │   └── 📄 model_loader.py
│   │   └── 📁 data/                       # 数据相关
│   │       ├── 📁 training/               # 训练数据
│   │       ├── 📁 models/                 # 预训练模型
│   │       └── 📄 data_processor.py
│   ├── 📁 tests/                          # AI服务测试
│   │   ├── 📁 unit/
│   │   └── 📁 integration/
│   └── 📄 pytest.ini
│
├── 📁 chat-service/                       # 聊天微服务
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 server.ts
│   ├── 📁 src/
│   │   ├── 📁 websocket/                  # WebSocket处理
│   │   │   ├── 📄 connectionManager.ts
│   │   │   ├── 📄 messageHandler.ts
│   │   │   └── 📄 roomManager.ts
│   │   ├── 📁 services/                   # 聊天服务
│   │   │   ├── 📄 messageService.ts
│   │   │   ├── 📄 encryptionService.ts
│   │   │   └── 📄 notificationService.ts
│   │   ├── 📁 models/                     # 聊天数据模型
│   │   │   ├── 📄 Message.ts
│   │   │   ├── 📄 Conversation.ts
│   │   │   └── 📄 ChatRoom.ts
│   │   └── 📁 utils/                      # 聊天工具
│   │       ├── 📄 encryption.ts
│   │       └── 📄 validation.ts
│   └── 📁 tests/
│
├── 📁 shared/                             # 共享代码和类型
│   ├── 📁 types/                          # 共享TypeScript类型
│   │   ├── 📄 user.ts
│   │   ├── 📄 match.ts
│   │   ├── 📄 chat.ts
│   │   └── 📄 api.ts
│   ├── 📁 utils/                          # 共享工具函数
│   │   ├── 📄 validation.ts
│   │   ├── 📄 constants.ts
│   │   └── 📄 helpers.ts
│   └── 📁 schemas/                        # 共享数据模式
│       ├── 📄 userSchema.ts
│       ├── 📄 matchSchema.ts
│       └── 📄 chatSchema.ts
│
├── 📁 infrastructure/                     # 基础设施配置
│   ├── 📁 kubernetes/                     # K8s部署配置
│   │   ├── 📄 namespace.yaml
│   │   ├── 📄 frontend-deployment.yaml
│   │   ├── 📄 backend-deployment.yaml
│   │   ├── 📄 ai-service-deployment.yaml
│   │   ├── 📄 chat-service-deployment.yaml
│   │   ├── 📄 postgres-deployment.yaml
│   │   ├── 📄 redis-deployment.yaml
│   │   └── 📄 ingress.yaml
│   ├── 📁 terraform/                      # 基础设施即代码
│   │   ├── 📄 main.tf
│   │   ├── 📄 variables.tf
│   │   ├── 📄 outputs.tf
│   │   └── 📁 modules/
│   │       ├── 📁 vpc/
│   │       ├── 📁 eks/
│   │       └── 📁 rds/
│   ├── 📁 monitoring/                     # 监控配置
│   │   ├── 📄 prometheus.yml
│   │   ├── 📄 grafana-dashboards/
│   │   └── 📄 alertmanager.yml
│   └── 📁 nginx/                          # Nginx配置
│       ├── 📄 nginx.conf
│       └── 📄 ssl/
│
├── 📁 ci-cd/                              # CI/CD配置
│   ├── 📁 github-actions/                 # GitHub Actions
│   │   ├── 📄 frontend.yml
│   │   ├── 📄 backend.yml
│   │   ├── 📄 ai-service.yml
│   │   └── 📄 deploy.yml
│   ├── 📁 scripts/                        # 部署脚本
│   │   ├── 📄 build.sh
│   │   ├── 📄 deploy.sh
│   │   ├── 📄 backup.sh
│   │   └── 📄 health-check.sh
│   └── 📄 .github/
│       └── 📄 workflows/
│
├── 📁 docs/                               # 项目文档
│   ├── 📄 api-documentation.md            # API文档
│   ├── 📄 deployment-guide.md             # 部署指南
│   ├── 📄 development-guide.md            # 开发指南
│   ├── 📄 testing-guide.md                # 测试指南
│   ├── 📄 architecture.md                 # 架构文档
│   ├── 📄 database-schema.md              # 数据库设计
│   ├── 📄 security.md                     # 安全文档
│   └── 📁 diagrams/                       # 架构图
│       ├── 📄 system-architecture.png
│       ├── 📄 database-relationships.png
│       └── 📄 deployment-flow.png
│
├── 📁 scripts/                            # 实用脚本
│   ├── 📄 setup-dev.sh                    # 开发环境设置
│   ├── 📄 seed-database.sh                # 数据库种子数据
│   ├── 📄 backup-database.sh              # 数据库备份
│   ├── 📄 migrate-database.sh             # 数据库迁移
│   └── 📄 health-check.sh                 # 健康检查
│
└── 📁 data/                               # 数据文件
    ├── 📁 migrations/                     # 数据库迁移文件
    │   ├── 📄 001_initial_schema.sql
    │   ├── 📄 002_add_user_tags.sql
    │   └── 📄 003_add_chat_tables.sql
    ├── 📁 seeds/                          # 种子数据
    │   ├── 📄 users.sql
    │   ├── 📄 tags.sql
    │   └── 📄 test_data.sql
    └── 📁 backups/                        # 备份文件
```

## 🚀 快速启动指南

### 1. 环境要求
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### 2. 开发环境设置
```bash
# 克隆项目
git clone <repository-url>
cd auto_project_1_friend_social_platform

# 安装依赖
npm install
cd frontend && npm install
cd ../mobile && npm install
cd ../backend && npm install
cd ../ai-service && pip install -r requirements.txt

# 启动开发环境
docker-compose up -d
npm run dev
```

### 3. 环境变量配置
复制 `.env.example` 到 `.env` 并配置必要的环境变量：
- 数据库连接
- Redis连接
- JWT密钥
- 第三方API密钥
- 云服务配置

## 📋 开发规范

### 代码规范
- 使用 ESLint + Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 使用 Conventional Commits 提交规范
- 代码覆盖率要求 > 80%

### 分支策略
- `main` - 生产环境分支
- `develop` - 开发环境分支
- `feature/*` - 功能开发分支
- `hotfix/*` - 紧急修复分支

### 测试策略
- 单元测试：Jest + React Testing Library
- 集成测试：Supertest
- E2E测试：Playwright
- 性能测试：Artillery

## 🔧 技术栈详情

### 前端技术栈
- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript 5+
- **样式**: Tailwind CSS + CSS Modules
- **状态管理**: Zustand
- **测试**: Jest + React Testing Library
- **构建工具**: Turbopack

### 后端技术栈
- **运行时**: Node.js 18+
- **框架**: Express.js + TypeScript
- **数据库**: PostgreSQL + Redis
- **ORM**: Prisma
- **认证**: JWT + Passport.js
- **API文档**: Swagger/OpenAPI

### AI服务技术栈
- **框架**: FastAPI
- **语言**: Python 3.11+
- **ML框架**: PyTorch 2.0+ / TensorFlow 2.13+
- **NLP**: HuggingFace Transformers
- **数据处理**: Pandas + NumPy
- **模型部署**: ONNX Runtime

### 移动端技术栈
- **框架**: React Native 0.72+
- **导航**: React Navigation 6+
- **状态管理**: Redux Toolkit
- **推送通知**: Firebase Cloud Messaging
- **地图服务**: React Native Maps

### 基础设施
- **容器化**: Docker + Kubernetes
- **CI/CD**: GitHub Actions
- **监控**: Prometheus + Grafana
- **日志**: ELK Stack
- **CDN**: CloudFlare
- **云服务**: AWS/GCP

## 📊 性能指标

### 目标性能
- 页面加载时间 < 2秒
- API响应时间 < 200ms
- 数据库查询 < 50ms
- 并发用户支持 > 10,000
- 系统可用性 > 99.9%

### 监控指标
- 应用性能监控 (APM)
- 用户行为分析
- 业务指标跟踪
- 基础设施监控
- 安全事件监控

## 🔒 安全考虑

### 数据安全
- 端到端加密 (E2EE)
- 数据脱敏和匿名化
- 定期安全审计
- 符合 GDPR/CCPA 法规

### 应用安全
- OAuth 2.0 认证
- CSRF 防护
- XSS 防护
- SQL 注入防护
- 速率限制

## 📈 扩展计划

### 第一阶段 (MVP)
- 基础用户注册/登录
- 简单匹配算法
- 基础聊天功能
- 移动端适配

### 第二阶段 (增长)
- AI 智能匹配
- 高级社交功能
- 性能优化
- 数据分析

### 第三阶段 (规模化)
- 微服务架构
- 国际化支持
- 企业级功能
- 开放 API

---

*此项目结构基于最佳实践设计，支持快速开发和规模化扩展*
