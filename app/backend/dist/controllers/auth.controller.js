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
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
exports.register = register;
exports.recover = recover;
exports.changePassword = changePassword;
exports.me = me;
const authService = __importStar(require("../services/auth.service"));
async function login(req, res, next) {
    try {
        const { username, password } = req.body;
        const result = await authService.loginUser(username, password);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function refresh(req, res, next) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ success: false, error: 'Refresh token required' });
            return;
        }
        const result = await authService.refreshAccessToken(refreshToken);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
function logout(req, res) {
    const { refreshToken } = req.body;
    if (refreshToken)
        authService.logoutUser(refreshToken);
    res.json({ success: true, message: 'Logged out' });
}
async function register(req, res, next) {
    try {
        const { username, password, role, secQuestion, secAnswer } = req.body;
        const result = await authService.registerUser(username, password, role || 'user', secQuestion || '', secAnswer || '');
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function recover(req, res, next) {
    try {
        const { username, secAnswer, newPassword } = req.body;
        const result = await authService.recoverUser(username, secAnswer, newPassword);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function changePassword(req, res, next) {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;
        const result = await authService.changePassword(userId, oldPassword, newPassword);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
function me(req, res) {
    res.json({ success: true, data: req.user });
}
//# sourceMappingURL=auth.controller.js.map