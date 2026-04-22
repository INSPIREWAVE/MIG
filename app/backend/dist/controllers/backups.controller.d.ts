import { Request, Response, NextFunction } from 'express';
export declare function listBackups(_req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createBackup(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function restoreBackup(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteBackup(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=backups.controller.d.ts.map