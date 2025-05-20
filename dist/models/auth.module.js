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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("./users.module");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
let AuthModel = class AuthModel {
    constructor(usersModel, jwtService) {
        this.usersModel = usersModel;
        this.jwtService = jwtService;
    }
    async validateUser(username, password) {
        const user = await this.usersModel.findOne(username);
        if (user && await bcrypt.compare(password, user.password)) {
            const _a = user.toObject(), { password } = _a, result = __rest(_a, ["password"]);
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { username: user.username, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
exports.AuthModel = AuthModel;
exports.AuthModel = AuthModel = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_module_1.UsersModel,
        jwt_1.JwtService])
], AuthModel);
//# sourceMappingURL=auth.module.js.map