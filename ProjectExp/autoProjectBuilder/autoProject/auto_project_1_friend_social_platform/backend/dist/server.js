"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const matches_1 = __importDefault(require("./routes/matches"));
const chat_1 = __importDefault(require("./routes/chat"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimit_1 = require("./middleware/rateLimit");
const auth_2 = require("./middleware/auth");
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env['FRONTEND_URL'] || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const PORT = process.env['PORT'] || 8000;
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: process.env['FRONTEND_URL'] || "http://localhost:3000",
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('combined', { stream: { write: (message) => logger_1.logger.info(message.trim()) } }));
app.use(rateLimit_1.apiRateLimit);
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env['NODE_ENV']
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/users', auth_2.authMiddleware, users_1.default);
app.use('/api/matches', auth_2.authMiddleware, matches_1.default);
app.use('/api/chat', auth_2.authMiddleware, chat_1.default);
app.use('/api/analytics', auth_2.authMiddleware, analytics_1.default);
io.on('connection', (socket) => {
    logger_1.logger.info(`User connected: ${socket.id}`);
    socket.on('join', (userId) => {
        socket.join(`user_${userId}`);
        logger_1.logger.info(`User ${userId} joined room`);
    });
    socket.on('send_message', (data) => {
        socket.to(`user_${data.receiverId}`).emit('receive_message', data);
    });
    socket.on('user_online', (userId) => {
        socket.broadcast.emit('user_status_change', {
            userId,
            status: 'online'
        });
    });
    socket.on('disconnect', () => {
        logger_1.logger.info(`User disconnected: ${socket.id}`);
    });
});
app.use(errorHandler_1.errorHandler);
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});
async function startServer() {
    try {
        await (0, database_1.connectDatabase)();
        logger_1.logger.info('Database connected successfully');
        await (0, redis_1.connectRedis)();
        logger_1.logger.info('Redis connected successfully');
        server.listen(PORT, () => {
            logger_1.logger.info(`Server running on port ${PORT}`);
            logger_1.logger.info(`Environment: ${process.env['NODE_ENV']}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger_1.logger.info('Process terminated');
    });
});
process.on('SIGINT', () => {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger_1.logger.info('Process terminated');
    });
});
startServer();
//# sourceMappingURL=server.js.map