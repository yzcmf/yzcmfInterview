import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const matchController: {
    getSuggestions(req: AuthRequest, res: Response): Promise<void>;
    likeUser(req: AuthRequest, res: Response): Promise<void>;
    passUser(req: AuthRequest, res: Response): Promise<void>;
    getMatches(req: AuthRequest, res: Response): Promise<void>;
};
//# sourceMappingURL=matchController.d.ts.map