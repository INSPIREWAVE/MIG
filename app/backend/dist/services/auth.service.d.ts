import { TokenPayload } from '../middleware/auth.middleware';
export declare function loginUser(username: string, password: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: TokenPayload;
}>;
export declare function refreshAccessToken(token: string): Promise<{
    accessToken: string;
}>;
export declare function logoutUser(token: string): void;
export declare function registerUser(username: string, password: string, role: string, secQuestion: string, secAnswer: string): Promise<any>;
export declare function recoverUser(username: string, secAnswer: string, newPassword: string): Promise<any>;
export declare function changePassword(userId: number, oldPassword: string, newPassword: string): Promise<any>;
//# sourceMappingURL=auth.service.d.ts.map