// src/line98.service.ts
import { Injectable } from '@nestjs/common';

interface Ball {
  color: string;
}

interface Position {
  x: number;
  y: number;
}

interface GameState {
  grid: (Ball | null)[][];
  selectedBall: Position | null;
  score: number;
  gameOver: boolean;
}

interface PendingBall extends Position {
  color: string;
}

@Injectable()
export class Line98Service {
  private games: Map<string, GameState> = new Map();
  private pendingBalls: Map<string, PendingBall[]> = new Map();
  private colors = ['red', 'blue', 'green', 'yellow', 'purple'];

  initializeGame(userId: string): {
    state: GameState;
    pendingBalls: PendingBall[];
  } {
    const grid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));

    for (let i = 0; i < 3; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * 9);
        y = Math.floor(Math.random() * 9);
      } while (grid[x][y]);
      grid[x][y] = { color: this.randomColor() };
    }

    const pendingBalls = this.generatePendingBalls(grid);
    this.pendingBalls.set(userId, pendingBalls);

    const state: GameState = {
      grid,
      selectedBall: null,
      score: 0,
      gameOver: false,
    };

    this.games.set(userId, state);
    return { state, pendingBalls };
  }

 move(
    userId: string,
    from: Position,
    to: Position,
  ): {
    state: GameState | null;
    path: Position[] | null;
    newBalls?: PendingBall[];
    exploded?: Position[];
    preExplodeGrid?: (Ball | null)[][];
    replacedPendingBall?: boolean;
  } {
    const state = this.games.get(userId);
    if (!state) return { state: null, path: null };

    const { grid } = state;
    let preExplodeGrid: (Ball | null)[][] | undefined = undefined; // 🟡 declare here
    
    // Get current pending balls
    const pending = this.pendingBalls.get(userId) || [];
    
    // Check if target position contains a pending ball
    let replacedPendingBall = false;
    const pendingAtTarget = pending.find(ball => ball.x === to.x && ball.y === to.y);
    
    // The move is valid if: there's a ball at 'from' AND either 'to' is empty OR 'to' has a pending ball
    if (!grid[from.x][from.y] || (grid[to.x][to.y] && !pendingAtTarget)) {
      return { state: null, path: null };
    }

    const path = this.findPath(grid, from, to);
    if (!path) return { state: null, path: null };

    // If we're moving to a position with a pending ball, remove it from pending
    if (pendingAtTarget) {
      const pendingIndex = pending.findIndex(ball => ball.x === to.x && ball.y === to.y);
      if (pendingIndex !== -1) {
        pending.splice(pendingIndex, 1);
        this.pendingBalls.set(userId, pending);
        replacedPendingBall = true;
      }
    }

    grid[to.x][to.y] = grid[from.x][from.y];
    grid[from.x][from.y] = null;
    state.selectedBall = null;

    const lines = this.checkLines(grid, to);
    let newBalls: PendingBall[] | null = null;
    let exploded: Position[] = [];

    if (lines.length >= 5) {
      preExplodeGrid = JSON.parse(JSON.stringify(grid)); // 🟢 grid BEFORE removal
      state.score += lines.length * 10;
      exploded = lines;
      lines.forEach((pos) => (grid[pos.x][pos.y] = null));
    } else {
      // Apply remaining pending balls to the grid
      pending.forEach((pos) => {
        grid[pos.x][pos.y] = { color: pos.color };
      });

      const emptyCount = grid.flat().filter((cell) => cell === null).length;
      const canCreateLine = this.findPotentialLineMoves(grid).length > 0;
      if (emptyCount <= 1 && !canCreateLine) state.gameOver = true;

      const newPending = this.generatePendingBalls(grid);
      this.pendingBalls.set(userId, newPending);
      newBalls = newPending;
    }

    return {
      state,
      path,
      newBalls,
      exploded,
      preExplodeGrid,
      replacedPendingBall, // Include this flag in the return value
    };
  }

  private generatePendingBalls(grid: (Ball | null)[][]): PendingBall[] {
    const empty: Position[] = [];
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        if (!grid[x][y]) empty.push({ x, y });
      }
    }
    const count = Math.min(3, empty.length);
    const result: PendingBall[] = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * empty.length);
      const pos = empty.splice(idx, 1)[0];
      result.push({ ...pos, color: this.randomColor() });
    }
    return result;
  }

  private randomColor(): string {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  getHelp(
    userId: string,
  ): { from: Position; to: Position; path: Position[]; reason: string } | null {
    const state = this.games.get(userId);
    if (!state) return null;

    const { grid } = state;

    const potentialLineMoves = this.findPotentialLineMoves(grid);
    if (potentialLineMoves.length > 0) {
      return {
        ...potentialLineMoves[0],
        reason: 'This move will create a line of 5+ balls and score points!',
      };
    }

    const setupMoves = this.findSetupMoves(grid);
    if (setupMoves.length > 0) {
      return {
        ...setupMoves[0],
        reason: 'This move helps set up a future line',
      };
    }

    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        if (grid[x][y]) {
          const from = { x, y };
          for (let toX = 0; toX < 9; toX++) {
            for (let toY = 0; toY < 9; toY++) {
              if (!grid[toX][toY]) {
                const to = { x: toX, y: toY };
                const path = this.findPath(grid, from, to);
                if (path) {
                  return {
                    from,
                    to,
                    path,
                    reason: 'This is one of the available moves',
                  };
                }
              }
            }
          }
        }
      }
    }
    return null;
  }

  private findPotentialLineMoves(
    grid: (Ball | null)[][],
  ): Array<{ from: Position; to: Position; path: Position[] }> {
    const moves: Array<{
      from: Position;
      to: Position;
      path: Position[];
      score: number;
    }> = [];

    for (let fromX = 0; fromX < 9; fromX++) {
      for (let fromY = 0; fromY < 9; fromY++) {
        if (!grid[fromX][fromY]) continue;
        const from = { x: fromX, y: fromY };
        const ballColor = grid[fromX][fromY]?.color;

        for (let toX = 0; toX < 9; toX++) {
          for (let toY = 0; toY < 9; toY++) {
            if (grid[toX][toY]) continue;
            const to = { x: toX, y: toY };
            const path = this.findPath(grid, from, to);
            if (!path) continue;
            const tempGrid = JSON.parse(JSON.stringify(grid));
            tempGrid[toX][toY] = { color: ballColor };
            tempGrid[fromX][fromY] = null;
            const lines = this.checkLines(tempGrid, to);
            if (lines.length >= 5) {
              moves.push({
                from,
                to,
                path,
                score: lines.length,
              });
            }
          }
        }
      }
    }
    return moves
      .sort((a, b) => b.score - a.score)
      .map(({ from, to, path }) => ({ from, to, path }));
  }

  private findSetupMoves(
    grid: (Ball | null)[][],
  ): Array<{ from: Position; to: Position; path: Position[] }> {
    const moves: Array<{
      from: Position;
      to: Position;
      path: Position[];
      potential: number;
    }> = [];
    for (let fromX = 0; fromX < 9; fromX++) {
      for (let fromY = 0; fromY < 9; fromY++) {
        if (!grid[fromX][fromY]) continue;
        const from = { x: fromX, y: fromY };
        const ballColor = grid[fromX][fromY]?.color;
        for (let toX = 0; toX < 9; toX++) {
          for (let toY = 0; toY < 9; toY++) {
            if (grid[toX][toY]) continue;
            const to = { x: toX, y: toY };
            const path = this.findPath(grid, from, to);
            if (!path) continue;
            const potential = this.calculatePotential(grid, to, ballColor);
            if (potential > 0) {
              moves.push({
                from,
                to,
                path,
                potential,
              });
            }
          }
        }
      }
    }
    return moves
      .sort((a, b) => b.potential - a.potential)
      .map(({ from, to, path }) => ({ from, to, path }));
  }

  private calculatePotential(
    grid: (Ball | null)[][],
    pos: Position,
    color: string,
  ): number {
    let potential = 0;
    const directions = [
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
    ];
    for (const { dx, dy } of directions) {
      let count = 0;
      for (let i = 1; i < 5; i++) {
        const x = pos.x + dx * i;
        const y = pos.y + dy * i;
        if (x < 0 || x >= 9 || y < 0 || y >= 9 || !grid[x][y]) break;
        if (grid[x][y]?.color === color) count++;
      }
      for (let i = 1; i < 5; i++) {
        const x = pos.x - dx * i;
        const y = pos.y - dy * i;
        if (x < 0 || x >= 9 || y < 0 || y >= 9 || !grid[x][y]) break;
        if (grid[x][y]?.color === color) count++;
      }
      potential += count * count;
    }
    return potential;
  }

  private findPath(
    grid: (Ball | null)[][],
    from: Position,
    to: Position,
  ): Position[] | null {
    const queue: Position[] = [from];
    const visited = new Set<string>([`${from.x},${from.y}`]);
    const parent = new Map<string, Position>();
    const directions = [
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
    ];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.x === to.x && current.y === to.y) {
        const path: Position[] = [];
        let pos = to;
        while (pos.x !== from.x || pos.y !== from.y) {
          path.push(pos);
          const key = `${pos.x},${pos.y}`;
          pos = parent.get(key)!;
        }
        path.push(from);
        return path.reverse();
      }
      for (const { dx, dy } of directions) {
        const nextX = current.x + dx;
        const nextY = current.y + dy;
        const key = `${nextX},${nextY}`;
        if (
          nextX >= 0 &&
          nextX < 9 &&
          nextY >= 0 &&
          nextY < 9 &&
          !visited.has(key) &&
          (grid[nextX][nextY] === null || (nextX === to.x && nextY === to.y))
        ) {
          visited.add(key);
          queue.push({ x: nextX, y: nextY });
          parent.set(key, current);
        }
      }
    }
    return null;
  }

  private checkLines(grid: (Ball | null)[][], pos: Position): Position[] {
    const color = grid[pos.x][pos.y]?.color;
    if (!color) return [];
    const directions = [
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
    ];
    const positionsToRemove: Position[] = [];
    for (const { dx, dy } of directions) {
      const line: Position[] = [{ x: pos.x, y: pos.y }];
      for (let i = 1; i < 9; i++) {
        const x = pos.x + dx * i;
        const y = pos.y + dy * i;
        if (x < 0 || x >= 9 || y < 0 || y >= 9 || grid[x][y]?.color !== color)
          break;
        line.push({ x, y });
      }
      for (let i = 1; i < 9; i++) {
        const x = pos.x - dx * i;
        const y = pos.y - dy * i;
        if (x < 0 || x >= 9 || y < 0 || y >= 9 || grid[x][y]?.color !== color)
          break;
        line.push({ x, y });
      }
      if (line.length >= 5) {
        positionsToRemove.push(...line);
      }
    }
    return Array.from(
      new Set(positionsToRemove.map((pos) => `${pos.x},${pos.y}`)),
    ).map((key) => {
      const [x, y] = key.split(',').map(Number);
      return { x, y };
    });
  }
}
