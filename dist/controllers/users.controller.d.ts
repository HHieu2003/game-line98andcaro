import { UsersModel } from '../models/users.module';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { UpdateUserDto } from '../models/dto/update-user.dto';
export declare class UsersController {
    private readonly usersModel;
    constructor(usersModel: UsersModel);
    register(createUserDto: CreateUserDto): Promise<import("../models/schemas/user.schema").User>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<import("../models/schemas/user.schema").User>;
    getProfile(req: any): Promise<import("../models/schemas/user.schema").User>;
}
