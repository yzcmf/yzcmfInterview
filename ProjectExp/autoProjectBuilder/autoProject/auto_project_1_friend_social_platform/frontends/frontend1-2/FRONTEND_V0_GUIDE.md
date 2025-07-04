# 使用 v0.com 开发前端指南

## 🎯 项目概述

本项目采用前后端分离架构：
- **前端**: 使用 v0.com 生成 Next.js 应用
- **后端**: Node.js + Express + TypeScript
- **AI服务**: Python + FastAPI
- **聊天服务**: WebSocket + Socket.IO

## 🚀 使用 v0.com 开发前端

### 1. 访问 v0.com
- 打开 [v0.com](https://v0.com)
- 使用您的账户登录

### 2. 创建新项目
在 v0.com 中创建新的 Next.js 项目，使用以下提示：

\`\`\`
Create a modern social platform frontend with Next.js 14, TypeScript, and Tailwind CSS. The app should include:

Features:
- User authentication (login/register)
- User profile management
- AI-powered friend matching system
- Real-time chat functionality
- User discovery and swiping interface
- Responsive design for mobile and desktop

Tech Stack:
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Zustand for state management
- React Hook Form with Zod validation
- Socket.IO client for real-time features
- NextAuth.js for authentication
- Framer Motion for animations

Design Requirements:
- Modern, clean UI with gradient backgrounds
- Card-based interface for user profiles
- Swipe gestures for matching
- Real-time chat interface
- Mobile-first responsive design
- Dark/light mode support

API Integration:
- Backend API running on http://localhost:8000
- WebSocket server on ws://localhost:8002
- AI service on http://localhost:8001

Key Pages:
- /login - Authentication page
- /register - User registration
- /dashboard - Main app dashboard
- /matches - View and manage matches
- /chat - Real-time messaging
- /profile - User profile management
- /discover - Find new friends

Components needed:
- UserCard component for profile display
- ChatWindow for messaging
- MatchQueue for swiping interface
- ProfileForm for editing user info
- Navigation bar and sidebar
- Loading states and error handling
\`\`\`

### 3. 项目结构建议
确保 v0.com 生成的项目包含以下结构：

\`\`\`
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── matches/page.tsx
│   │   │   ├── chat/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── discover/page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── matching/
│   │   └── profile/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── store/
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
\`\`\`

### 4. 环境变量配置
在生成的项目中创建 `.env.local` 文件：

\`\`\`env
# API配置
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8002
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8001

# NextAuth配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# 第三方服务
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id
\`\`\`

### 5. 关键组件开发提示

#### 用户卡片组件
\`\`\`typescript
// 请求 v0.com 生成类似这样的组件
interface UserCardProps {
  user: {
    id: string;
    name: string;
    age: number;
    bio: string;
    photos: string[];
    interests: string[];
    location: string;
  };
  onLike: () => void;
  onPass: () => void;
  onSuperLike: () => void;
}
\`\`\`

#### 聊天组件
\`\`\`typescript
// 请求 v0.com 生成实时聊天界面
interface ChatWindowProps {
  matchId: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
}
\`\`\`

#### 匹配队列
\`\`\`typescript
// 请求 v0.com 生成滑动匹配界面
interface MatchQueueProps {
  users: User[];
  onMatch: (userId: string) => void;
  onPass: (userId: string) => void;
}
\`\`\`

### 6. API 集成指南

#### 认证 API
\`\`\`typescript
// 登录
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// 注册
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username",
  "firstName": "John",
  "lastName": "Doe"
}
\`\`\`

#### 用户 API
\`\`\`typescript
// 获取用户资料
GET /api/users/profile

// 更新用户资料
PUT /api/users/profile
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Hello world!",
  "location": "New York"
}
\`\`\`

#### 匹配 API
\`\`\`typescript
// 获取推荐用户
GET /api/matches/suggestions

// 喜欢用户
POST /api/matches/like
{
  "targetUserId": "user-id"
}

// 跳过用户
POST /api/matches/pass
{
  "targetUserId": "user-id"
}
\`\`\`

#### 聊天 API
\`\`\`typescript
// 获取聊天列表
GET /api/chat/conversations

// 获取消息历史
GET /api/chat/messages/:conversationId

// 发送消息 (WebSocket)
socket.emit('send_message', {
  conversationId: 'conv-id',
  content: 'Hello!',
  receiverId: 'user-id'
});
\`\`\`

### 7. WebSocket 集成

\`\`\`typescript
// 在 v0.com 中请求生成 WebSocket 集成代码
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_WS_URL!);

socket.on('connect', () => {
  console.log('Connected to WebSocket');
});

socket.on('receive_message', (message) => {
  // 处理接收到的消息
});

socket.on('user_status_change', (data) => {
  // 处理用户状态变化
});
\`\`\`

### 8. 状态管理

使用 Zustand 进行状态管理：

\`\`\`typescript
// 请求 v0.com 生成状态管理代码
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

interface ChatStore {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: Message[];
  sendMessage: (message: string) => void;
}

interface MatchStore {
  suggestions: User[];
  matches: User[];
  loadSuggestions: () => Promise<void>;
  likeUser: (userId: string) => Promise<void>;
  passUser: (userId: string) => Promise<void>;
}
\`\`\`

### 9. 样式和动画

请求 v0.com 生成：
- 现代化的渐变背景
- 卡片滑动动画
- 加载状态动画
- 响应式设计
- 深色/浅色主题切换

### 10. 测试和部署

#### 本地开发
\`\`\`bash
# 启动后端服务
cd backend && npm run dev

# 启动AI服务
cd ai-service && python -m uvicorn app:app --reload --port 8001

# 启动聊天服务
cd chat-service && npm run dev

# 启动前端 (v0.com 生成的项目)
npm run dev
\`\`\`

#### 生产部署
- 使用 Vercel 部署前端
- 使用 Docker 部署后端服务
- 配置环境变量
- 设置域名和SSL

## 🔧 开发建议

1. **组件化开发**: 将UI拆分为可复用的组件
2. **类型安全**: 使用TypeScript确保类型安全
3. **错误处理**: 实现完善的错误处理和用户反馈
4. **性能优化**: 使用React.memo、useMemo等优化性能
5. **可访问性**: 确保应用符合WCAG标准
6. **测试**: 编写单元测试和集成测试

## 📞 支持

如果在使用 v0.com 开发过程中遇到问题：
1. 查看 v0.com 的文档和示例
2. 参考 Next.js 官方文档
3. 检查后端API文档
4. 联系开发团队获取支持

---

*此指南将帮助您使用 v0.com 快速开发出高质量的前端应用*
