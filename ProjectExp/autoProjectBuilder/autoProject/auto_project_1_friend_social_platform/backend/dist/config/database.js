"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.getDatabase = exports.connectDatabase = void 0;
const pg_1 = require("pg");
const logger_1 = require("../utils/logger");
let pool;
const connectDatabase = async () => {
    try {
        pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        logger_1.logger.info('Database connected successfully');
    }
    catch (error) {
        logger_1.logger.error('Database connection failed:', error);
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
const getDatabase = () => {
    if (!pool) {
        throw new Error('Database not initialized. Call connectDatabase() first.');
    }
    return pool;
};
exports.getDatabase = getDatabase;
const closeDatabase = async () => {
    if (pool) {
        await pool.end();
        logger_1.logger.info('Database connection closed');
    }
};
exports.closeDatabase = closeDatabase;
//# sourceMappingURL=database.js.map