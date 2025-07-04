"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/:matchId', (req, res) => {
    res.json({
        success: true,
        data: {
            messages: []
        }
    });
});
router.post('/:matchId/messages', (req, res) => {
    res.json({
        success: true,
        data: {
            message: {
                id: 'msg-1',
                content: req.body.content,
                senderId: req.body.senderId,
                timestamp: new Date().toISOString()
            }
        }
    });
});
exports.default = router;
//# sourceMappingURL=chat.js.map