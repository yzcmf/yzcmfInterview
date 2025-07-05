import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// 导入路由
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import matchRoutes from './routes/matches';
import chatRoutes from './routes/chat';
import analyticsRoutes from './routes/analytics';

// 导入中间件
import { errorHandler } from './middleware/errorHandler';
import { createRateLimitMiddleware, createLoginRateLimit } from './middleware/rateLimit';
// import { authMiddleware } from './middleware/auth';

// 导入配置
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { logger } from './utils/logger';
import { PortManager } from './utils/portManager';

// 加载环境变量
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3002",
      "http://localhost:3004",
      "http://localhost:3005"
    ],
    methods: ["GET", "POST"]
  }
});

// Port configuration - will try 8000, then 8002-8005 if not available
const preferredPort = parseInt(process.env['PORT'] || '8000');
const fallbackPorts = [8002, 8003, 8004, 8005];

// 基础中间件
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3002",
    "http://localhost:3004",
    "http://localhost:3005"
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// 健康检查
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV']
  });
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);

// WebSocket连接处理
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // 加入用户房间
  socket.on('join', (userId: string) => {
    socket.join(`user_${userId}`);
    logger.info(`User ${userId} joined room`);
  });

  // 处理聊天消息
  socket.on('send_message', (data) => {
    // 广播消息到接收者
    socket.to(`user_${data.receiverId}`).emit('receive_message', data);
  });

  // 处理在线状态
  socket.on('user_online', (userId: string) => {
    socket.broadcast.emit('user_status_change', {
      userId,
      status: 'online'
    });
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// 错误处理中间件
app.use(errorHandler);

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// 启动服务器
async function startServer() {
  try {
    // 连接数据库
    await connectDatabase();
    logger.info('Database connected successfully');

    // 连接Redis
    await connectRedis();
    logger.info('Redis connected successfully');

    // 速率限制中间件（在Redis连接后注册）
    app.use(createRateLimitMiddleware());
    app.use('/api/auth/login', createLoginRateLimit());

    // 创建端口管理器
    const portManager = new PortManager({
      preferredPort,
      fallbackPorts
    });

    // 启动服务器
    await portManager.startServerOnAvailablePort(server, (port) => {
      logger.info(`Server running on port ${port}`);
      logger.info(`Environment: ${process.env['NODE_ENV']}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

startServer(); 