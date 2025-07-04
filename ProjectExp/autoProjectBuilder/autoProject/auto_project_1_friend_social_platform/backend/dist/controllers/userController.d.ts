import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const userController: {
    getProfile(req: AuthRequest, res: Response): Promise<void>;
    updateProfile(req: AuthRequest, res: Response): Promise<void>;
    uploadAvatar(req: AuthRequest, res: Response): Promise<void>;
    discoverUsers(req: AuthRequest, res: Response): Promise<void>;
    getUserById(req: AuthRequest, res: Response): Promise<void>;
    updatePreferences(req: AuthRequest, res: Response): Promise<void>;
    getUserStats(req: AuthRequest, res: Response): Promise<void>;
    deleteAccount(req: AuthRequest, res: Response): Promise<void>;
};
//# sourceMappingURL=userController.d.ts.map