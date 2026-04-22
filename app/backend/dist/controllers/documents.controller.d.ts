import { Request, Response, NextFunction } from 'express';
export declare function listClientDocuments(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function uploadClientDocument(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteClientDocument(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function listCompanyDocuments(_req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function uploadCompanyDocument(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteCompanyDocument(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function downloadDocument(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=documents.controller.d.ts.map