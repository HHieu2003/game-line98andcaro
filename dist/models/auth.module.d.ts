import { UsersModel } from './users.module';
import { JwtService } from '@nestjs/jwt';
export declare class AuthModel {
    private usersModel;
    private jwtService;
    constructor(usersModel: UsersModel, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
