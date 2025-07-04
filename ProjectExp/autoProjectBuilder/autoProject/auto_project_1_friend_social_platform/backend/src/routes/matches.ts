import express from 'express';
import { matchController } from '../controllers/matchController';

const router = express.Router();

// 获取推荐用户
router.get('/suggestions', matchController.getSuggestions);

// 喜欢用户
router.post('/like', matchController.likeUser);

// 跳过用户
router.post('/pass', matchController.passUser);

// 获取匹配列表
router.get('/', matchController.getMatches);

export default router; 