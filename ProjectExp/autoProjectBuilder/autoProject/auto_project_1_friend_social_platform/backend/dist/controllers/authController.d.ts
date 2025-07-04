import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const authController: {
    register(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    refreshToken(req: Request, res: Response): Promise<void>;
    logout(req: AuthRequest, res: Response): Promise<void>;
    forgotPassword(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
    verifyEmail(req: Request, res: Response): Promise<void>;
    resendVerification(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=authController.d.ts.map