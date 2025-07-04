import { Router } from 'express';
import { body } from 'express-validator';
import { userController } from '../controllers/userController';
import { validateRequest } from '../middleware/validation';
import { upload } from '../middleware/upload';

const router = Router();

// 获取用户资料
router.get('/profile', userController.getProfile);

// 更新用户资料
router.put('/profile', [
  body('firstName').optional().isLength({ min: 1, max: 50 }),
  body('lastName').optional().isLength({ min: 1, max: 50 }),
  body('bio').optional().isLength({ max: 500 }),
  body('location').optional().isLength({ max: 100 }),
  body('birthDate').optional().isISO8601(),
  body('gender').optional().isIn(['male', 'female', 'other']),
  validateRequest
], userController.updateProfile);

// 上传头像
router.post('/avatar', upload.single('avatar'), userController.uploadAvatar);

// 获取用户列表（用于匹配）
router.get('/discover', userController.discoverUsers);

// 获取用户详情
router.get('/:userId', userController.getUserById);

// 更新用户偏好设置
router.put('/preferences', [
  body('ageRange').optional().isObject(),
  body('distance').optional().isInt({ min: 1, max: 100 }),
  body('interests').optional().isArray(),
  body('genderPreference').optional().isArray(),
  validateRequest
], userController.updatePreferences);

// 获取用户统计
router.get('/stats/overview', userController.getUserStats);

// 删除账户
router.delete('/account', userController.deleteAccount);

export default router; 