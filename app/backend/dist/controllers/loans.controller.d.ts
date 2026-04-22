import { Request, Response, NextFunction } from 'express';
export declare function listLoans(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getLoan(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createLoan(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateLoan(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteLoan(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getLoanInstallments(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getLoanPayments(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getLoanSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function recalculateLoan(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function assessDefault(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getEarlySettlement(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function earlySettle(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getOverdueInstallments(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getUpcomingInstallments(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=loans.controller.d.ts.map