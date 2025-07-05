import { AuthRequest } from "../types";
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

export const matchController = {
  // 获取推荐用户
  async getSuggestions(_req: Request, res: Response) {
    try {
      // 这里应该调用AI服务获取推荐
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
    } catch (error) {
      logger.error('Get suggestions error:', error);
      res.status(500).json({
        success: false,
        error: '获取推荐失败',
        code: 'GET_SUGGESTIONS_ERROR'
      });
    }
  },

  // 喜欢用户
  async likeUser(req: Request, res: Response) {
    try {
      // 这里应该处理喜欢逻辑并检查是否匹配
      const isMatch = Math.random() > 0.7; // 模拟匹配概率
      const userId = (req as AuthRequest).user?.id;
      const targetUserId = req.body.targetUserId;
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
      } else {
        res.json({
          success: true,
          data: {
            isMatch: false
          },
          message: '已发送喜欢'
        });
      }
    } catch (error) {
      logger.error('Like user error:', error);
      res.status(500).json({
        success: false,
        error: '操作失败',
        code: 'LIKE_USER_ERROR'
      });
    }
  },

  // 跳过用户
  async passUser(_req: Request, res: Response) {
    try {
      // 这里应该处理跳过逻辑
      res.json({
        success: true,
        message: '已跳过'
      });
    } catch (error) {
      logger.error('Pass user error:', error);
      res.status(500).json({
        success: false,
        error: '操作失败',
        code: 'PASS_USER_ERROR'
      });
    }
  },

  // 获取匹配列表
  async getMatches(_req: Request, res: Response) {
    try {
      // 这里应该从数据库获取匹配列表
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
    } catch (error) {
      logger.error('Get matches error:', error);
      res.status(500).json({
        success: false,
        error: '获取匹配列表失败',
        code: 'GET_MATCHES_ERROR'
      });
    }
  }
}; 