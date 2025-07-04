import { Pool } from 'pg';
import { logger } from '../utils/logger';

let pool: Pool;

export const connectDatabase = async (): Promise<void> => {
  try {
    pool = new Pool({
      connectionString: process.env["DATABASE_URL"],
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // 测试连接
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

export const getDatabase = (): Pool => {
  if (!pool) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return pool;
};

export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    logger.info('Database connection closed');
  }
}; 