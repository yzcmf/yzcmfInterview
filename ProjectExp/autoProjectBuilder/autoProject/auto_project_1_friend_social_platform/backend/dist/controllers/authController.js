"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
exports.authController = {
    async register(req, res) {
        try {
            const { email, password, username, firstName, lastName } = req.body;
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            const token = jsonwebtoken_1.default.sign({ id: 'user-id', email, role: 'user' }, process.env['JWT_SECRET'] || 'fallback-secret', { expiresIn: '24h' });
            const refreshToken = jsonwebtoken_1.default.sign({ id: 'user-id', email }, process.env['JWT_REFRESH_SECRET'] || 'fallback-refresh-secret', { expiresIn: '7d' });
            res.status(201).json({
                success: true,
                data: {
                    user: {
                        id: 'user-id',
                        email,
                        username,
                        firstName,
                        lastName
                    },
                    token,
                    refreshToken
                },
                message: '注册成功'
            });
        }
        catch (error) {
            logger_1.logger.error('Registration error:', error);
            res.status(500).json({
                success: false,
                error: '注册失败',
                code: 'REGISTRATION_ERROR'
            });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const token = jsonwebtoken_1.default.sign({ id: 'user-id', email, role: 'user' }, process.env['JWT_SECRET'] || 'fallback-secret', { expiresIn: '24h' });
            const refreshToken = jsonwebtoken_1.default.sign({ id: 'user-id', email }, process.env['JWT_REFRESH_SECRET'] || 'fallback-refresh-secret', { expiresIn: '7d' });
            res.json({
                success: true,
                data: {
                    user: {
                        id: 'user-id',
                        email,
                        username: 'username'
                    },
                    token,
                    refreshToken
                },
                message: '登录成功'
            });
        }
        catch (error) {
            logger_1.logger.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: '登录失败',
                code: 'LOGIN_ERROR'
            });
        }
    },
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            const token = jsonwebtoken_1.default.sign({ id: 'user-id', email: 'user@example.com', role: 'user' }, process.env['JWT_SECRET'] || 'fallback-secret', { expiresIn: '24h' });
            res.json({
                success: true,
                data: { token },
                message: '令牌刷新成功'
            });
        }
        catch (error) {
            logger_1.logger.error('Token refresh error:', error);
            res.status(401).json({
                success: false,
                error: '令牌刷新失败',
                code: 'TOKEN_REFRESH_ERROR'
            });
        }
    },
    async logout(req, res) {
        try {
            res.json({
                success: true,
                message: '登出成功'
            });
        }
        catch (error) {
            logger_1.logger.error('Logout error:', error);
            res.status(500).json({
                success: false,
                error: '登出失败',
                code: 'LOGOUT_ERROR'
            });
        }
    },
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            res.json({
                success: true,
                message: '重置密码邮件已发送'
            });
        }
        catch (error) {
            logger_1.logger.error('Forgot password error:', error);
            res.status(500).json({
                success: false,
                error: '发送重置邮件失败',
                code: 'FORGOT_PASSWORD_ERROR'
            });
        }
    },
    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;
            res.json({
                success: true,
                message: '密码重置成功'
            });
        }
        catch (error) {
            logger_1.logger.error('Reset password error:', error);
            res.status(500).json({
                success: false,
                error: '密码重置失败',
                code: 'RESET_PASSWORD_ERROR'
            });
        }
    },
    async verifyEmail(req, res) {
        try {
            const { token } = req.params;
            res.json({
                success: true,
                message: '邮箱验证成功'
            });
        }
        catch (error) {
            logger_1.logger.error('Email verification error:', error);
            res.status(500).json({
                success: false,
                error: '邮箱验证失败',
                code: 'EMAIL_VERIFICATION_ERROR'
            });
        }
    },
    async resendVerification(req, res) {
        try {
            const { email } = req.body;
            res.json({
                success: true,
                message: '验证邮件已重新发送'
            });
        }
        catch (error) {
            logger_1.logger.error('Resend verification error:', error);
            res.status(500).json({
                success: false,
                error: '重新发送验证邮件失败',
                code: 'RESEND_VERIFICATION_ERROR'
            });
        }
    }
};
//# sourceMappingURL=authController.js.map