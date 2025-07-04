"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const userController_1 = require("../controllers/userController");
const validation_1 = require("../middleware/validation");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
router.get('/profile', userController_1.userController.getProfile);
router.put('/profile', [
    (0, express_validator_1.body)('firstName').optional().isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('lastName').optional().isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('bio').optional().isLength({ max: 500 }),
    (0, express_validator_1.body)('location').optional().isLength({ max: 100 }),
    (0, express_validator_1.body)('birthDate').optional().isISO8601(),
    (0, express_validator_1.body)('gender').optional().isIn(['male', 'female', 'other']),
    validation_1.validateRequest
], userController_1.userController.updateProfile);
router.post('/avatar', upload_1.upload.single('avatar'), userController_1.userController.uploadAvatar);
router.get('/discover', userController_1.userController.discoverUsers);
router.get('/:userId', userController_1.userController.getUserById);
router.put('/preferences', [
    (0, express_validator_1.body)('ageRange').optional().isObject(),
    (0, express_validator_1.body)('distance').optional().isInt({ min: 1, max: 100 }),
    (0, express_validator_1.body)('interests').optional().isArray(),
    (0, express_validator_1.body)('genderPreference').optional().isArray(),
    validation_1.validateRequest
], userController_1.userController.updatePreferences);
router.get('/stats/overview', userController_1.userController.getUserStats);
router.delete('/account', userController_1.userController.deleteAccount);
exports.default = router;
//# sourceMappingURL=users.js.map