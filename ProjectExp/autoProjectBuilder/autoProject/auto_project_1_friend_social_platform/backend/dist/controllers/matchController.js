"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchController = void 0;
const logger_1 = require("../utils/logger");
exports.matchController = {
    async getSuggestions(req, res) {
        try {
            const userId = req.user?.id;
            const { limit = 10 } = req.query;
            const suggestions = [
                {
                    user: {
                        id: 'user-1',
                        username: 'jane_doe',
                        firstName: 'Jane',
                        lastName: 'Doe',
                        bio: 'Hello!',
                        avatar: 'https://example.com/avatar1.jpg',
                        age: 25,
                        location: 'New York',
                        interests: ['music', 'travel']
                    },
                    compatibilityScore: 0.85,
                    matchReasons: ['共同兴趣', '年龄匹配', '地理位置接近']
                }
            ];
            res.json({
                success: true,
                data: {
                    suggestions
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Get suggestions error:', error);
            res.status(500).json({
                success: false,
                error: '获取推荐失败',
                code: 'GET_SUGGESTIONS_ERROR'
            });
        }
    },
    async likeUser(req, res) {
        try {
            const userId = req.user?.id;
            const { targetUserId } = req.body;
            const isMatch = Math.random() > 0.7;
            if (isMatch) {
                res.json({
                    success: true,
                    data: {
                        isMatch: true,
                        match: {
                            id: 'match-id',
                            users: [userId, targetUserId],
                            createdAt: new Date().toISOString()
                        }
                    },
                    message: '匹配成功！'
                });
            }
            else {
                res.json({
                    success: true,
                    data: {
                        isMatch: false
                    },
                    message: '已发送喜欢'
                });
            }
        }
        catch (error) {
            logger_1.logger.error('Like user error:', error);
            res.status(500).json({
                success: false,
                error: '操作失败',
                code: 'LIKE_USER_ERROR'
            });
        }
    },
    async passUser(req, res) {
        try {
            const userId = req.user?.id;
            const { targetUserId } = req.body;
            res.json({
                success: true,
                message: '已跳过'
            });
        }
        catch (error) {
            logger_1.logger.error('Pass user error:', error);
            res.status(500).json({
                success: false,
                error: '操作失败',
                code: 'PASS_USER_ERROR'
            });
        }
    },
    async getMatches(req, res) {
        try {
            const userId = req.user?.id;
            const matches = [
                {
                    id: 'match-1',
                    user: {
                        id: 'user-1',
                        username: 'jane_doe',
                        firstName: 'Jane',
                        lastName: 'Doe',
                        avatar: 'https://example.com/avatar1.jpg'
                    },
                    matchedAt: new Date().toISOString(),
                    lastMessage: {
                        content: 'Hello!',
                        timestamp: new Date().toISOString()
                    }
                }
            ];
            res.json({
                success: true,
                data: {
                    matches
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Get matches error:', error);
            res.status(500).json({
                success: false,
                error: '获取匹配列表失败',
                code: 'GET_MATCHES_ERROR'
            });
        }
    }
};
//# sourceMappingURL=matchController.js.map