"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
const express_validator_1 = require("express-validator");
function validateRequest(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            success: false,
            error: 'Validation failed',
            fields: errors.array().map((e) => ({ field: e.path ?? 'unknown', message: e.msg })),
        });
        return;
    }
    next();
}
//# sourceMappingURL=validation.middleware.js.map