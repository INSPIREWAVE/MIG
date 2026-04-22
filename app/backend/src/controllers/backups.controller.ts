import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function listBackups(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await db.getBackups();
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: result.backups });
  } catch (err) {
    next(err);
  }
}

export async function createBackup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { notes } = req.body;
    const result = await db.createBackup(notes || '');
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('CREATE_BACKUP', 'backup', result.id, null, null);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function restoreBackup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.restoreBackup(id);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    db.logAudit('RESTORE_BACKUP', 'backup', id, null, null);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function deleteBackup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    db.logAudit('DELETE_BACKUP', 'backup', id, null, null);
    res.json({ success: true, message: `Backup ${id} deleted` });
  } catch (err) {
    next(err);
  }
}
