"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('username').isLength({ min: 3, max: 30 }),
    (0, express_validator_1.body)('firstName').notEmpty(),
    (0, express_validator_1.body)('lastName').notEmpty(),
    validation_1.validateRequest
], authController_1.authController.register);
router.post('/login', [
    rateLimit_1.loginRateLimit,
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty(),
    validation_1.validateRequest
], authController_1.authController.login);
router.post('/refresh', [
    (0, express_validator_1.body)('refreshToken').notEmpty(),
    validation_1.validateRequest
], authController_1.authController.refreshToken);
router.post('/logout', authController_1.authController.logout);
router.post('/forgot-password', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    validation_1.validateRequest
], authController_1.authController.forgotPassword);
router.post('/reset-password', [
    (0, express_validator_1.body)('token').notEmpty(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    validation_1.validateRequest
], authController_1.authController.resetPassword);
router.get('/verify-email/:token', authController_1.authController.verifyEmail);
router.post('/resend-verification', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    validation_1.validateRequest
], authController_1.authController.resendVerification);
exports.default = router;
//# sourceMappingURL=auth.js.map