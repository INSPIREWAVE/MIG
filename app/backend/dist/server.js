"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const adapter_1 = require("./db/adapter");
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const clients_routes_1 = __importDefault(require("./routes/clients.routes"));
const loans_routes_1 = __importDefault(require("./routes/loans.routes"));
const payments_routes_1 = __importDefault(require("./routes/payments.routes"));
const penalties_routes_1 = __importDefault(require("./routes/penalties.routes"));
const collateral_routes_1 = __importDefault(require("./routes/collateral.routes"));
const accounts_routes_1 = __importDefault(require("./routes/accounts.routes"));
const documents_routes_1 = __importDefault(require("./routes/documents.routes"));
const audit_routes_1 = __importDefault(require("./routes/audit.routes"));
const reports_routes_1 = __importDefault(require("./routes/reports.routes"));
const backups_routes_1 = __importDefault(require("./routes/backups.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const sync_routes_1 = __importDefault(require("./routes/sync.routes"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '4000', 10);
const DB_PATH = process.env.DB_PATH || path_1.default.join(process.cwd(), 'data', 'migl360.db');
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
}));
app.use((0, morgan_1.default)(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/clients', clients_routes_1.default);
app.use('/api/loans', loans_routes_1.default);
app.use('/api/payments', payments_routes_1.default);
app.use('/api/penalties', penalties_routes_1.default);
app.use('/api/collateral', collateral_routes_1.default);
app.use('/api/accounts', accounts_routes_1.default);
app.use('/api/documents', documents_routes_1.default);
app.use('/api/audit', audit_routes_1.default);
app.use('/api/reports', reports_routes_1.default);
app.use('/api/backups', backups_routes_1.default);
app.use('/api/settings', settings_routes_1.default);
app.use('/api/users', users_routes_1.default);
app.use('/api/sync', sync_routes_1.default);
app.get('/api/health', (_req, res) => {
    res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});
app.use(error_middleware_1.errorHandler);
async function bootstrap() {
    try {
        await adapter_1.db.init(path_1.default.dirname(DB_PATH));
        console.log(`[DB] Initialized at ${DB_PATH}`);
        app.listen(PORT, () => {
            console.log(`[Server] Running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
        });
    }
    catch (err) {
        console.error('[Server] Failed to start:', err);
        process.exit(1);
    }
}
bootstrap();
exports.default = app;
//# sourceMappingURL=server.js.map