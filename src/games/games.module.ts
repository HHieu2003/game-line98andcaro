import { Module } from '@nestjs/common';
import { GamesGateway } from './games.gateway';
import { Line98Service } from './line98.service';
import { CaroService } from './caro.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [GamesGateway, Line98Service, CaroService, JwtService],
})
export class GamesModule {}