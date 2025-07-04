import express from 'express';

const router = express.Router();

// 获取聊天历史
router.get('/:matchId', (req, res) => {
  res.json({
    success: true,
    data: {
      messages: []
    }
  });
});

// 发送消息
router.post('/:matchId/messages', (req, res) => {
  res.json({
    success: true,
    data: {
      message: {
        id: 'msg-1',
        content: req.body.content,
        senderId: req.body.senderId,
        timestamp: new Date().toISOString()
      }
    }
  });
});

export default router; 