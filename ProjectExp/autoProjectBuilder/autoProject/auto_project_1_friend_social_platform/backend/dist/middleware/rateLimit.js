"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRateLimit = exports.loginRateLimit = exports.rateLimitMiddleware = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const redis_1 = require("../config/redis");
const RedisStore = require('rate-limit-redis');
const redis = (0, redis_1.getRedis)();
exports.rateLimitMiddleware = (0, express_rate_limit_1.default)({
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
    }),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.loginRateLimit = (0, express_rate_limit_1.default)({
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
    }),
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: 'Too many login attempts, please try again later.',
    },
    skipSuccessfulRequests: true,
});
exports.apiRateLimit = (0, express_rate_limit_1.default)({
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
    }),
    windowMs: 60 * 1000,
    max: 60,
    message: {
        error: 'API rate limit exceeded, please try again later.',
    },
});
//# sourceMappingURL=rateLimit.js.map