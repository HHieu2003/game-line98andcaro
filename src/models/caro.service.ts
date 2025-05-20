import { Injectable } from '@nestjs/common';

export interface CaroGame {
  gameId: string;
  board: (string | null)[][];
  players: { userId: string; symbol: 'X' | 'O' }[];
  currentTurn: 'X' | 'O';
  status: 'waiting' | 'playing' | 'finished';
  winner: string | null;
}

@Injectable()
export class CaroService {
  private readonly BOARD_SIZE = 30;
  private readonly WIN_CONDITION = 5;

  private games: Map<string, CaroGame> = new Map();

  joinGame(userId: string): { gameId: string; symbol: 'X' | 'O' } {
    let gameId: string | null = null;

    for (const [id, game] of this.games) {
      if (game.status === 'waiting' && game.players.length === 1) {
        if (game.players.some(p => p.userId === userId)) {
          return { gameId: id, symbol: game.players.find(p => p.userId === userId)!.symbol };
        }
        gameId = id;
        game.players.push({ userId, symbol: 'O' });
        game.status = 'playing';
        game.currentTurn = 'X';
        console.log(`Player ${userId} joined game ${gameId} as O`);
        break;
      }
    }

    if (!gameId) {
      gameId = Math.random().toString(36).substring(2);
      const board = Array(this.BOARD_SIZE)
        .fill(null)
        .map(() => Array(this.BOARD_SIZE).fill(null));
      this.games.set(gameId, {
        gameId,
        board,
        players: [{ userId, symbol: 'X' }],
        currentTurn: 'X',
        status: 'waiting',
        winner: null,
      });
      console.log(`New game ${gameId} created for player ${userId} as X`);
    }

    return { gameId, symbol: this.games.get(gameId)!.players.find(p => p.userId === userId)!.symbol };
  }

  makeMove(gameId: string, userId: string, x: number, y: number): { game?: CaroGame; error?: string } {
    const game = this.games.get(gameId);
    if (!game || game.status !== 'playing') {
      console.error(`Game ${gameId} not found or not in playing state`);
      return { error: 'Game not found or not in playing state' };
    }

    const player = game.players.find(p => p.userId === userId);
    if (!player || player.symbol !== game.currentTurn) {
      console.log(`Invalid move by ${userId}: Not ${game.currentTurn}'s turn`);
      return { error: `It's not your turn. Current turn: ${game.currentTurn}` };
    }

    if (x < 0 || x >= this.BOARD_SIZE || y < 0 || y >= this.BOARD_SIZE) {
      return { error: 'Invalid position' };
    }

    if (game.board[x][y]) {
      return { error: 'Position already taken' };
    }

    game.board[x][y] = player.symbol;
    game.currentTurn = game.currentTurn === 'X' ? 'O' : 'X';

    const winner = this.checkWinner(game.board);
    if (winner) {
      game.status = 'finished';
      game.winner = game.players.find(p => p.symbol === winner)?.userId || null;
      console.log(`Game ${gameId} finished, winner: ${game.winner}`);
    } else if (game.board.every(row => row.every(cell => cell))) {
      game.status = 'finished';
      game.winner = null;
      console.log(`Game ${gameId} finished, draw`);
    }

    return { game };
  }

  getGame(gameId: string): CaroGame | null {
    return this.games.get(gameId) || null;
  }

  private checkWinner(board: (string | null)[][]): string | null {
    const directions = [
      [0, 1],  // Ngang
      [1, 0],  // Dọc
      [1, 1],  // Chéo chính
      [1, -1], // Chéo phụ
    ];

    for (let i = 0; i < this.BOARD_SIZE; i++) {
      for (let j = 0; j < this.BOARD_SIZE; j++) {
        const current = board[i][j];
        if (!current) continue;

        for (const [dx, dy] of directions) {
          let count = 1;
          let x = i + dx;
          let y = j + dy;

          while (
            x >= 0 && x < this.BOARD_SIZE &&
            y >= 0 && y < this.BOARD_SIZE &&
            board[x][y] === current
          ) {
            count++;
            if (count === this.WIN_CONDITION) return current;
            x += dx;
            y += dy;
          }
        }
      }
    }

    return null;
  }
}