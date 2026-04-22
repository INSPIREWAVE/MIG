import { Request, Response, NextFunction } from 'express';
import { db } from '../db/adapter';

export async function getSetting(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { key } = req.params;
    const result = await db.getSetting(key);
    res.json({ success: true, data: { key, value: result } });
  } catch (err) {
    next(err);
  }
}

export async function setSetting(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { key, value } = req.body;
    if (!key) {
      res.status(400).json({ success: false, error: 'Key is required' });
      return;
    }
    const result = await db.setSetting(key, value);
    if (!result.success) throw Object.assign(new Error(result.error), { statusCode: 400 });
    res.json({ success: true, data: { key, value } });
  } catch (err) {
    next(err);
  }
}
