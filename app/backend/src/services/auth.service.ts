import jwt from 'jsonwebtoken';
import { db } from '../db/adapter';
import { TokenPayload } from '../middleware/auth.middleware';

const refreshTokenStore = new Set<string>();

function getSecrets() {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  if (!JWT_SECRET || !JWT_REFRESH_SECRET) throw new Error('JWT secrets not configured');
  return { JWT_SECRET, JWT_REFRESH_SECRET };
}

function signAccessToken(payload: TokenPayload): string {
  const { JWT_SECRET } = getSecrets();
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

function signRefreshToken(payload: TokenPayload): string {
  const { JWT_REFRESH_SECRET } = getSecrets();
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export async function loginUser(username: string, password: string) {
  const result = await db.loginUser(username, password);
  if (!result.success) throw Object.assign(new Error(result.error || 'Invalid credentials'), { statusCode: 401 });

  const user = result.user;
  const payload: TokenPayload = {
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

export async function refreshAccessToken(token: string) {
  const { JWT_REFRESH_SECRET } = getSecrets();
  if (!refreshTokenStore.has(token)) {
    throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401 });
  }
  const payload = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  const newPayload: TokenPayload = {
    id: payload.id,
    username: payload.username,
    role: payload.role,
    permissions: payload.permissions,
  };
  const accessToken = signAccessToken(newPayload);
  return { accessToken };
}

export function logoutUser(token: string) {
  refreshTokenStore.delete(token);
}

export async function registerUser(username: string, password: string, role: string, secQuestion: string, secAnswer: string, permissions?: string) {
  const result = await db.registerUser({ username, password, secQuestion, secAnswer, role, permissions: permissions || 'read,write' });
  if (!result.success) throw Object.assign(new Error(result.error || 'Registration failed'), { statusCode: 400 });
  return result;
}

export async function recoverUser(username: string, secAnswer: string, newPassword: string) {
  const result = await db.recoverUser(username, secAnswer, newPassword);
  if (!result.success) throw Object.assign(new Error(result.error || 'Recovery failed'), { statusCode: 400 });
  return result;
}

export async function changePassword(username: string, oldPassword: string, newPassword: string) {
  const result = await db.changePassword(username, oldPassword, newPassword);
  if (!result.success) throw Object.assign(new Error(result.error || 'Password change failed'), { statusCode: 400 });
  return result;
}
