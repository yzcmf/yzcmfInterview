"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const matchController_1 = require("../controllers/matchController");
const router = express_1.default.Router();
router.get('/suggestions', matchController_1.matchController.getSuggestions);
router.post('/like', matchController_1.matchController.likeUser);
router.post('/pass', matchController_1.matchController.passUser);
router.get('/', matchController_1.matchController.getMatches);
exports.default = router;
//# sourceMappingURL=matches.js.map