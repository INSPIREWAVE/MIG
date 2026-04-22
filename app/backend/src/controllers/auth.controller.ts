import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, password } = req.body;
    const result = await authService.loginUser(username, password);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, error: 'Refresh token required' });
      return;
    }
    const result = await authService.refreshAccessToken(refreshToken);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export function logout(req: Request, res: Response): void {
  const { refreshToken } = req.body;
  if (refreshToken) authService.logoutUser(refreshToken);
  res.json({ success: true, message: 'Logged out' });
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, password, role, secQuestion, secAnswer } = req.body;
    const result = await authService.registerUser(username, password, role || 'user', secQuestion || '', secAnswer || '');
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function recover(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, secAnswer, newPassword } = req.body;
    const result = await authService.recoverUser(username, secAnswer, newPassword);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { oldPassword, newPassword } = req.body;
    const result = await authService.changePassword(userId, oldPassword, newPassword);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export function me(req: Request, res: Response): void {
  res.json({ success: true, data: req.user });
}
