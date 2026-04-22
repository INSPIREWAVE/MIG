import { Request, Response, NextFunction } from 'express';
export declare function listClients(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getClient(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createClient(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateClient(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteClient(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getClientLoans(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getClientDocuments(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getClientActivity(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getClientStats(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateKycStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function toggleBlacklist(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=clients.controller.d.ts.map