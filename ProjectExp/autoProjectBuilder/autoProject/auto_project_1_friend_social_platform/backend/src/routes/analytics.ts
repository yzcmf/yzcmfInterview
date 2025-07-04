import express from 'express';

const router = express.Router();

// 获取用户统计数据
router.get('/user-stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalMatches: 0,
      totalLikes: 0,
      totalPasses: 0,
      profileViews: 0
    }
  });
});

// 获取平台统计数据
router.get('/platform-stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: 0,
      totalMatches: 0,
      activeUsers: 0
    }
  });
});

export default router; 