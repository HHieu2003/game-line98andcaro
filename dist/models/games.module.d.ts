import { CaroService, CaroGame } from './caro.service';
import { Line98Service, Ball, GameState, PendingBall, Position } from './line98.service';
export declare class GamesModel {
    private readonly caroService;
    private readonly line98Service;
    constructor(caroService: CaroService, line98Service: Line98Service);
    joinCaroGame(userId: string): {
        gameId: string;
        symbol: 'X' | 'O';
    };
    makeCaroMove(gameId: string, userId: string, x: number, y: number): {
        game?: CaroGame;
        error?: string;
    };
    getCaroGame(gameId: string): CaroGame | null;
    initializeLine98Game(userId: string): {
        state: GameState;
        pendingBalls: PendingBall[];
    };
    moveLine98Ball(userId: string, from: Position, to: Position): {
        state: GameState | null;
        path: Position[] | null;
        newBalls?: PendingBall[];
        exploded?: Position[];
        preExplodeGrid?: (Ball | null)[][];
        replacedPendingBall?: boolean;
    };
    getLine98Help(userId: string): {
        from: Position;
        to: Position;
        path: Position[];
        reason: string;
    } | null;
}
