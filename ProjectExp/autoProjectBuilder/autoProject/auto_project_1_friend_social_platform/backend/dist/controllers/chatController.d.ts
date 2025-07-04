import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}
export declare const chatController: {
    getConversations(req: AuthRequest, res: Response): Promise<void>;
    getMessages(req: AuthRequest, res: Response): Promise<void>;
    sendMessage(req: AuthRequest, res: Response): Promise<void>;
    markAsRead(req: AuthRequest, res: Response): Promise<void>;
};
export {};
//# sourceMappingURL=chatController.d.ts.map