"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeRedis = exports.getRedis = exports.connectRedis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("../utils/logger");
let redisClient;
const connectRedis = async () => {
    try {
        redisClient = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379', {
            retryDelayOnFailover: 100,
            maxRetriesPerRequest: 3,
            lazyConnect: true,
        });
        redisClient.on('connect', () => {
            logger_1.logger.info('Redis connected successfully');
        });
        redisClient.on('error', (error) => {
            logger_1.logger.error('Redis connection error:', error);
        });
        redisClient.on('close', () => {
            logger_1.logger.info('Redis connection closed');
        });
        await redisClient.connect();
    }
    catch (error) {
        logger_1.logger.error('Redis connection failed:', error);
        throw error;
    }
};
exports.connectRedis = connectRedis;
const getRedis = () => {
    if (!redisClient) {
        throw new Error('Redis not initialized. Call connectRedis() first.');
    }
    return redisClient;
};
exports.getRedis = getRedis;
const closeRedis = async () => {
    if (redisClient) {
        await redisClient.quit();
        logger_1.logger.info('Redis connection closed');
    }
};
exports.closeRedis = closeRedis;
//# sourceMappingURL=redis.js.map