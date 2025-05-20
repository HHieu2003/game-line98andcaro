"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const user_schema_1 = require("./schemas/user.schema");
let UsersModel = class UsersModel {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const { username, password } = createUserDto;
        const existingUser = await this.userModel.findOne({ username });
        if (existingUser) {
            throw new common_1.ConflictException('Username already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this.userModel(Object.assign(Object.assign({}, createUserDto), { password: hashedPassword }));
        return user.save();
    }
    async findOne(username) {
        return this.userModel.findOne({ username }).exec();
    }
    async update(username, updateUserDto) {
        const user = await this.userModel.findOne({ username });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateUserDto.newPassword) {
            if (!updateUserDto.currentPassword) {
                throw new common_1.UnauthorizedException('Phải nhập mật khẩu hiện tại');
            }
            const isPasswordValid = await bcrypt.compare(updateUserDto.currentPassword, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Mật khẩu hiện tại không đúng');
            }
            user.password = await bcrypt.hash(updateUserDto.newPassword, 10);
        }
        if (updateUserDto.email)
            user.email = updateUserDto.email;
        if (updateUserDto.name)
            user.name = updateUserDto.name;
        if (updateUserDto.age)
            user.age = updateUserDto.age;
        return user.save();
    }
};
exports.UsersModel = UsersModel;
exports.UsersModel = UsersModel = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersModel);
//# sourceMappingURL=users.module.js.map