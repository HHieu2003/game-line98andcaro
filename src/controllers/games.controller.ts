import { Controller } from '@nestjs/common';
import { GamesGateway } from '../gateways/games.gateway';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesGateway: GamesGateway) {}
}