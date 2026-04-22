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
const ctrl = __importStar(require("../controllers/clients.controller"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateToken);
router.get('/', ctrl.listClients);
router.get('/:id', ctrl.getClient);
router.post('/', [(0, express_validator_1.body)('name').notEmpty().withMessage('Name is required')], validation_middleware_1.validateRequest, ctrl.createClient);
router.put('/:id', ctrl.updateClient);
router.delete('/:id', (0, auth_middleware_1.requireRole)('admin'), ctrl.deleteClient);
router.get('/:id/loans', ctrl.getClientLoans);
router.get('/:id/documents', ctrl.getClientDocuments);
router.get('/:id/activity', ctrl.getClientActivity);
router.get('/:id/stats', ctrl.getClientStats);
router.post('/:id/kyc', [(0, express_validator_1.body)('kycStatus').notEmpty()], validation_middleware_1.validateRequest, ctrl.updateKycStatus);
router.post('/:id/blacklist', ctrl.toggleBlacklist);
exports.default = router;
//# sourceMappingURL=clients.routes.js.map