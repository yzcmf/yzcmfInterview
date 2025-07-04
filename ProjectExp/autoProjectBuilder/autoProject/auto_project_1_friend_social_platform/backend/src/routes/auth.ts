import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { loginRateLimit } from '../middleware/rateLimit';

const router = Router();

// 注册
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('username').isLength({ min: 3, max: 30 }),
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  validateRequest
], authController.register);

// 登录
router.post('/login', [
  loginRateLimit,
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validateRequest
], authController.login);

// 刷新token
router.post('/refresh', [
  body('refreshToken').notEmpty(),
  validateRequest
], authController.refreshToken);

// 登出
router.post('/logout', authController.logout);

// 忘记密码
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail(),
  validateRequest
], authController.forgotPassword);

// 重置密码
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 6 }),
  validateRequest
], authController.resetPassword);

// 验证邮箱
router.get('/verify-email/:token', authController.verifyEmail);

// 重新发送验证邮件
router.post('/resend-verification', [
  body('email').isEmail().normalizeEmail(),
  validateRequest
], authController.resendVerification);

export default router; 