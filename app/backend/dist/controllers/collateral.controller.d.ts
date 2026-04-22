import { Request, Response, NextFunction } from 'express';
export declare function listCollateral(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getCollateralByLoan(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getCollateralByClient(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function addCollateral(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateCollateral(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteCollateral(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function forfeitCollateral(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=collateral.controller.d.ts.map