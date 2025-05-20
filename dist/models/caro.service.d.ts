export interface CaroGame {
    gameId: string;
    board: (string | null)[][];
    players: {
        userId: string;
        symbol: 'X' | 'O';
    }[];
    currentTurn: 'X' | 'O';
    status: 'waiting' | 'playing' | 'finished';
    winner: string | null;
}
export declare class CaroService {
    private readonly BOARD_SIZE;
    private readonly WIN_CONDITION;
    private games;
    joinGame(userId: string): {
        gameId: string;
        symbol: 'X' | 'O';
    };
    makeMove(gameId: string, userId: string, x: number, y: number): {
        game?: CaroGame;
        error?: string;
    };
    getGame(gameId: string): CaroGame | null;
    private checkWinner;
}
