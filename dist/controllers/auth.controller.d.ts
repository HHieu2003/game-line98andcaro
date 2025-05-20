import { AuthModel } from '../models/auth.module';
export declare class AuthController {
    private authModel;
    constructor(authModel: AuthModel);
    login(loginDto: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
}
