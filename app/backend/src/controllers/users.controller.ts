import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function listUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.getAllUsers();
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.users });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const { role, permissions } = req.body;
    const result = await db.updateUserRole(id, role, permissions || '');
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('UPDATE_USER_ROLE', 'user', id, null, JSON.stringify({ role, permissions }));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function toggleUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const { isActive } = req.body;
    const result = await db.toggleUserStatus(id, isActive);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('TOGGLE_USER_STATUS', 'user', id, null, JSON.stringify({ isActive }));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (req.user && req.user.id === id) {
      res.status(400).json({ success: false, error: 'Cannot delete your own account' });
      return;
    }
    db.logAudit('DELETE_USER', 'user', id, null, null);
    res.json({ success: true, message: `User ${id} deleted` });
  } catch (err) {
    next(err);
  }
}
