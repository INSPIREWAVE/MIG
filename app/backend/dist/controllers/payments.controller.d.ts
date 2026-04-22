import { Request, Response, NextFunction } from 'express';
export declare function listPayments(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function addPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function reversePayment(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getPaymentStats(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getPaymentPipeline(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getProfitAnalysis(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getCollectionTrends(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=payments.controller.d.ts.map