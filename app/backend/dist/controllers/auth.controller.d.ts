import { Request, Response, NextFunction } from 'express';
export declare function login(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function refresh(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function logout(req: Request, res: Response): void;
export declare function register(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function recover(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function changePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function me(req: Request, res: Response): void;
//# sourceMappingURL=auth.controller.d.ts.map