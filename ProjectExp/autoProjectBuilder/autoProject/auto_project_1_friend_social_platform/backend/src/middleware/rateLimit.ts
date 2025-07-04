import rateLimit from 'express-rate-limit';
import { getRedis } from '../config/redis';

// 创建Redis存储适配器
const RedisStore = require('rate-limit-redis');
const redis = getRedis();

// 通用速率限制
export const rateLimitMiddleware = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: unknown[]) => redis.call(...args),
  }),
  windowMs: parseInt(process.env["RATE_LIMIT_WINDOW_MS"] || '900000'), // 15分钟
  max: parseInt(process.env["RATE_LIMIT_MAX_REQUESTS"] || '100'), // 限制每个IP 100次请求
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 登录速率限制
export const loginRateLimit = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: any[]) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 限制每个IP 5次登录尝试
  message: {
    error: 'Too many login attempts, please try again later.',
  },
  skipSuccessfulRequests: true,
});

// API速率限制
export const apiRateLimit = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: any[]) => redis.call(...args),
  }),
  windowMs: 60 * 1000, // 1分钟
  max: 60, // 限制每个IP 60次API请求
  message: {
    error: 'API rate limit exceeded, please try again later.',
  },
}); 