"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/user-stats', (req, res) => {
    res.json({
        success: true,
        data: {
            totalMatches: 0,
            totalLikes: 0,
            totalPasses: 0,
            profileViews: 0
        }
    });
});
router.get('/platform-stats', (req, res) => {
    res.json({
        success: true,
        data: {
            totalUsers: 0,
            totalMatches: 0,
            activeUsers: 0
        }
    });
});
exports.default = router;
//# sourceMappingURL=analytics.js.map