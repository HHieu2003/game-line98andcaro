import { Injectable } from '@nestjs/common';
import { CaroService, CaroGame } from './caro.service';
import { Line98Service, Ball, GameState, PendingBall, Position } from './line98.service';

@Injectable()
export class GamesModel {
  constructor(
    private readonly caroService: CaroService,
    private readonly line98Service: Line98Service,
  ) {}

  joinCaroGame(userId: string): { gameId: string; symbol: 'X' | 'O' } {
    return this.caroService.joinGame(userId);
  }

  makeCaroMove(gameId: string, userId: string, x: number, y: number): { game?: CaroGame; error?: string } {
    return this.caroService.makeMove(gameId, userId, x, y);
  }

  getCaroGame(gameId: string): CaroGame | null {
    return this.caroService.getGame(gameId);
  }

  initializeLine98Game(userId: string): { state: GameState; pendingBalls: PendingBall[] } {
    return this.line98Service.initializeGame(userId);
  }

  moveLine98Ball(userId: string, from: Position, to: Position): {
    state: GameState | null;
    path: Position[] | null;
    newBalls?: PendingBall[];
    exploded?: Position[];
    preExplodeGrid?: (Ball | null)[][];
    replacedPendingBall?: boolean;
  } {
    return this.line98Service.move(userId, from, to);
  }

  getLine98Help(userId: string): { from: Position; to: Position; path: Position[]; reason: string } | null {
    return this.line98Service.getHelp(userId);
  }
}