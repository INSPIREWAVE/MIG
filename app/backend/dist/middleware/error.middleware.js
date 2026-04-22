"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    const statusCode = err.statusCode || 500;
    const code = err.code || 'INTERNAL_ERROR';
    const message = process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'An unexpected error occurred'
        : err.message || 'Unknown error';
    console.error(`[Error] ${statusCode} ${code}: ${err.message}`, err.stack);
    res.status(statusCode).json({ success: false, error: message, code });
}
//# sourceMappingURL=error.middleware.js.map