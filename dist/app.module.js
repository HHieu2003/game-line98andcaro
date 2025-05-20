"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./controllers/app.controller");
const config_controller_1 = require("./controllers/config.controller");
const app_service_1 = require("./app.service");
const auth_controller_1 = require("./controllers/auth.controller");
const users_controller_1 = require("./controllers/users.controller");
const games_controller_1 = require("./controllers/games.controller");
const games_gateway_1 = require("./gateways/games.gateway");
const auth_module_1 = require("./models/auth.module");
const users_module_1 = require("./models/users.module");
const games_module_1 = require("./models/games.module");
const user_schema_1 = require("./models/schemas/user.schema");
const jwt_strategy_1 = require("./gateways/jwt.strategy");
const caro_service_1 = require("./models/caro.service");
const line98_service_1 = require("./models/line98.service");
const jwt_1 = require("@nestjs/jwt");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGO_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '60m' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [app_controller_1.AppController, config_controller_1.ConfigController, auth_controller_1.AuthController, users_controller_1.UsersController, games_controller_1.GamesController],
        providers: [
            app_service_1.AppService,
            games_gateway_1.GamesGateway,
            auth_module_1.AuthModel,
            users_module_1.UsersModel,
            games_module_1.GamesModel,
            jwt_strategy_1.JwtStrategy,
            caro_service_1.CaroService,
            line98_service_1.Line98Service,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map