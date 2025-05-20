import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './controllers/app.controller';
import { ConfigController } from './controllers/config.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { GamesController } from './controllers/games.controller';
import { GamesGateway } from './gateways/games.gateway';
import { AuthModel } from './models/auth.module';
import { UsersModel } from './models/users.module';
import { GamesModel } from './models/games.module';
import { User, UserSchema } from './models/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './gateways/jwt.strategy';
import { CaroService } from './models/caro.service';
import { Line98Service } from './models/line98.service';
import { JwtModule } from '@nestjs/jwt'; // Thêm import này

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' }, // Tùy chọn, token hết hạn sau 60 phút
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, ConfigController, AuthController, UsersController, GamesController],
  providers: [
    AppService,
    GamesGateway,
    AuthModel,
    UsersModel,
    GamesModel,
    JwtStrategy,
    CaroService,
    Line98Service,
  ],
})
export class AppModule {}