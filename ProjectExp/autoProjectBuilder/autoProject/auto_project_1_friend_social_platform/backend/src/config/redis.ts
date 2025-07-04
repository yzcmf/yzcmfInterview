import Redis from 'ioredis';
import { logger } from '../utils/logger';

let redisClient: Redis;

export const connectRedis = async (): Promise<void> => {
  try {
    redisClient = new Redis(process.env["REDIS_URL"] || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      enableReadyCheck: true,
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    redisClient.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });

    redisClient.on('close', () => {
      logger.info('Redis connection closed');
    });

    await redisClient.connect();
  } catch (error) {
    logger.error('Redis connection failed:', error);
    throw error;
  }
};

export const getRedis = (): Redis => {
  if (!redisClient) {
    throw new Error('Redis not initialized. Call connectRedis() first.');
  }
  return redisClient;
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis connection closed');
  }
}; 