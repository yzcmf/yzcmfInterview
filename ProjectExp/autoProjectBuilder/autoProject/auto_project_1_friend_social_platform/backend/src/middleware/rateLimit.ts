import rateLimit from 'express-rate-limit';
import { getRedis } from '../config/redis';

const RedisStoreModule = require('rate-limit-redis');
const RedisStore = RedisStoreModule.default || RedisStoreModule;

export function createRateLimitMiddleware() {
  const redis = getRedis();
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args: [string, ...Array<string | number | Buffer>]) => redis.call.apply(redis, args),
    }),
    windowMs: parseInt(process.env["RATE_LIMIT_WINDOW_MS"] || '900000'),
    max: parseInt(process.env["RATE_LIMIT_MAX_REQUESTS"] || '100'),
    message: {
      error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}

export function createLoginRateLimit() {
  const redis = getRedis();
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args: [string, ...Array<string | number | Buffer>]) => redis.call.apply(redis, args),
    }),
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
      error: 'Too many login attempts, please try again later.',
    },
    skipSuccessfulRequests: true,
  });
}

export function createApiRateLimit() {
  const redis = getRedis();
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args: [string, ...Array<string | number | Buffer>]) => redis.call.apply(redis, args),
    }),
    windowMs: 60 * 1000,
    max: 60,
    message: {
      error: 'API rate limit exceeded, please try again later.',
    },
  });
} 