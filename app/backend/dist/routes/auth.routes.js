"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const ctrl = __importStar(require("../controllers/auth.controller"));
const router = (0, express_1.Router)();
router.post('/login', [(0, express_validator_1.body)('username').notEmpty(), (0, express_validator_1.body)('password').notEmpty()], validation_middleware_1.validateRequest, ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);
router.post('/register', auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)('admin'), [
    (0, express_validator_1.body)('username').notEmpty().isLength({ min: 3 }),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('role').optional().isIn(['admin', 'manager', 'user', 'viewer']),
], validation_middleware_1.validateRequest, ctrl.register);
router.post('/recover', [(0, express_validator_1.body)('username').notEmpty(), (0, express_validator_1.body)('secAnswer').notEmpty(), (0, express_validator_1.body)('newPassword').isLength({ min: 6 })], validation_middleware_1.validateRequest, ctrl.recover);
router.post('/change-password', auth_middleware_1.authenticateToken, [(0, express_validator_1.body)('oldPassword').notEmpty(), (0, express_validator_1.body)('newPassword').isLength({ min: 6 })], validation_middleware_1.validateRequest, ctrl.changePassword);
router.get('/me', auth_middleware_1.authenticateToken, ctrl.me);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map