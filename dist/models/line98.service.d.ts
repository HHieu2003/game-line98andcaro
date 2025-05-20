export interface Ball {
    color: string;
}
export interface Position {
    x: number;
    y: number;
}
export interface GameState {
    grid: (Ball | null)[][];
    selectedBall: Position | null;
    score: number;
    gameOver: boolean;
}
export interface PendingBall extends Position {
    color: string;
}
export declare class Line98Service {
    private games;
    private pendingBalls;
    private colors;
    initializeGame(userId: string): {
        state: GameState;
        pendingBalls: PendingBall[];
    };
    move(userId: string, from: Position, to: Position): {
        state: GameState | null;
        path: Position[] | null;
        newBalls?: PendingBall[];
        exploded?: Position[];
        preExplodeGrid?: (Ball | null)[][];
        replacedPendingBall?: boolean;
    };
    private generatePendingBalls;
    private randomColor;
    getHelp(userId: string): {
        from: Position;
        to: Position;
        path: Position[];
        reason: string;
    } | null;
    private findPotentialLineMoves;
    private findSetupMoves;
    private calculatePotential;
    private findPath;
    private checkLines;
}
