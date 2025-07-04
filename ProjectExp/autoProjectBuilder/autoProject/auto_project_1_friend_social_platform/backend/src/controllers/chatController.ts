import { AuthRequest } from "../types";
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const chatController = {
  // 获取对话列表
  async getConversations(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      // 这里应该从数据库获取对话列表
      const conversations = [
        {
          id: 'conversation-1',
          matchId: 'match-1',
          user: {
            id: 'user-1',
            username: 'jane_doe',
            firstName: 'Jane',
            lastName: 'Doe',
            avatar: 'https://example.com/avatar1.jpg'
          },
          lastMessage: {
            content: 'Hello!',
            timestamp: new Date().toISOString(),
            senderId: 'user-1'
          },
          unreadCount: 2
        }
      ];

      res.json({
        success: true,
        data: {
          conversations
        }
      });
    } catch (error) {
      logger.error('Get conversations error:', error);
      res.status(500).json({
        success: false,
        error: '获取对话列表失败',
        code: 'GET_CONVERSATIONS_ERROR'
      });
    }
  },

  // 获取消息历史
  async getMessages(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { conversationId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      // 这里应该从数据库获取消息历史
      const messages = [
        {
          id: 'message-1',
          content: 'Hello!',
          senderId: 'user-1',
          receiverId: userId,
          timestamp: new Date().toISOString(),
          isRead: true
        }
      ];

      res.json({
        success: true,
        data: {
          messages,
          pagination: {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            total: 100,
            pages: 2
          }
        }
      });
    } catch (error) {
      logger.error('Get messages error:', error);
      res.status(500).json({
        success: false,
        error: '获取消息历史失败',
        code: 'GET_MESSAGES_ERROR'
      });
    }
  },

  // 发送消息
  async sendMessage(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { conversationId, content, receiverId } = req.body;

      // 这里应该保存消息到数据库
      const message = {
        id: 'message-id',
        content,
        senderId: userId,
        receiverId,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      res.json({
        success: true,
        data: {
          message
        },
        message: '消息发送成功'
      });
    } catch (error) {
      logger.error('Send message error:', error);
      res.status(500).json({
        success: false,
        error: '发送消息失败',
        code: 'SEND_MESSAGE_ERROR'
      });
    }
  },

  // 标记消息为已读
  async markAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { conversationId } = req.params;

      // 这里应该更新消息状态
      res.json({
        success: true,
        message: '消息已标记为已读'
      });
    } catch (error) {
      logger.error('Mark as read error:', error);
      res.status(500).json({
        success: false,
        error: '操作失败',
        code: 'MARK_AS_READ_ERROR'
      });
    }
  }
}; 