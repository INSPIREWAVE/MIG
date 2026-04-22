"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
exports.refreshAccessToken = refreshAccessToken;
exports.logoutUser = logoutUser;
exports.registerUser = registerUser;
exports.recoverUser = recoverUser;
exports.changePassword = changePassword;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adapter_1 = require("../db/adapter");
const refreshTokenStore = new Set();
function getSecrets() {
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    if (!JWT_SECRET || !JWT_REFRESH_SECRET)
        throw new Error('JWT secrets not configured');
    return { JWT_SECRET, JWT_REFRESH_SECRET };
}
function signAccessToken(payload) {
    const { JWT_SECRET } = getSecrets();
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}
function signRefreshToken(payload) {
    const { JWT_REFRESH_SECRET } = getSecrets();
    return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}
async function loginUser(username, password) {
    const result = await adapter_1.db.loginUser(username, password);
    if (!result.success)
        throw Object.assign(new Error(result.error || 'Invalid credentials'), { statusCode: 401 });
    const user = result.user;
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role || 'user',
        permissions: user.permissions || '',
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    refreshTokenStore.add(refreshToken);
    return { accessToken, refreshToken, user: payload };
}
async function refreshAccessToken(token) {
    const { JWT_REFRESH_SECRET } = getSecrets();
    if (!refreshTokenStore.has(token)) {
        throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401 });
    }
    const payload = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
    const newPayload = {
        id: payload.id,
        username: payload.username,
        role: payload.role,
        permissions: payload.permissions,
    };
    const accessToken = signAccessToken(newPayload);
    return { accessToken };
}
function logoutUser(token) {
    refreshTokenStore.delete(token);
}
async function registerUser(username, password, role, secQuestion, secAnswer) {
    const result = await adapter_1.db.registerUser(username, password, role, secQuestion, secAnswer);
    if (!result.success)
        throw Object.assign(new Error(result.error || 'Registration failed'), { statusCode: 400 });
    return result;
}
async function recoverUser(username, secAnswer, newPassword) {
    const result = await adapter_1.db.recoverUser(username, secAnswer, newPassword);
    if (!result.success)
        throw Object.assign(new Error(result.error || 'Recovery failed'), { statusCode: 400 });
    return result;
}
async function changePassword(userId, oldPassword, newPassword) {
    const result = await adapter_1.db.changePassword(userId, oldPassword, newPassword);
    if (!result.success)
        throw Object.assign(new Error(result.error || 'Password change failed'), { statusCode: 400 });
    return result;
}
//# sourceMappingURL=auth.service.js.map