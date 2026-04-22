import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export function validateRequest(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      error: 'Validation failed',
      fields: errors.array().map((e) => ({ field: (e as { path?: string }).path ?? 'unknown', message: e.msg })),
    });
    return;
  }
  next();
}
