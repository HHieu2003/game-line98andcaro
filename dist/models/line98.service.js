"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line98Service = void 0;
const common_1 = require("@nestjs/common");
let Line98Service = class Line98Service {
    constructor() {
        this.games = new Map();
        this.pendingBalls = new Map();
        this.colors = ['red', 'blue', 'green', 'yellow', 'purple'];
    }
    initializeGame(userId) {
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
        const state = {
            grid,
            selectedBall: null,
            score: 0,
            gameOver: false,
        };
        this.games.set(userId, state);
        return { state, pendingBalls };
    }
    move(userId, from, to) {
        const state = this.games.get(userId);
        if (!state)
            return { state: null, path: null };
        const { grid } = state;
        let preExplodeGrid = undefined;
        const pending = this.pendingBalls.get(userId) || [];
        let replacedPendingBall = false;
        const pendingAtTarget = pending.find(ball => ball.x === to.x && ball.y === to.y);
        if (!grid[from.x][from.y] || (grid[to.x][to.y] && !pendingAtTarget)) {
            return { state: null, path: null };
        }
        const path = this.findPath(grid, from, to);
        if (!path)
            return { state: null, path: null };
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
        let newBalls = null;
        let exploded = [];
        if (lines.length >= 5) {
            preExplodeGrid = JSON.parse(JSON.stringify(grid));
            state.score += lines.length * 10;
            exploded = lines;
            lines.forEach((pos) => (grid[pos.x][pos.y] = null));
        }
        else {
            pending.forEach((pos) => {
                grid[pos.x][pos.y] = { color: pos.color };
            });
            const emptyCount = grid.flat().filter((cell) => cell === null).length;
            const canCreateLine = this.findPotentialLineMoves(grid).length > 0;
            if (emptyCount <= 1 && !canCreateLine)
                state.gameOver = true;
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
            replacedPendingBall,
        };
    }
    generatePendingBalls(grid) {
        const empty = [];
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (!grid[x][y])
                    empty.push({ x, y });
            }
        }
        const count = Math.min(3, empty.length);
        const result = [];
        for (let i = 0; i < count; i++) {
            const idx = Math.floor(Math.random() * empty.length);
            const pos = empty.splice(idx, 1)[0];
            result.push(Object.assign(Object.assign({}, pos), { color: this.randomColor() }));
        }
        return result;
    }
    randomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    getHelp(userId) {
        const state = this.games.get(userId);
        if (!state)
            return null;
        const { grid } = state;
        const potentialLineMoves = this.findPotentialLineMoves(grid);
        if (potentialLineMoves.length > 0) {
            return Object.assign(Object.assign({}, potentialLineMoves[0]), { reason: 'This move will create a line of 5+ balls and score points!' });
        }
        const setupMoves = this.findSetupMoves(grid);
        if (setupMoves.length > 0) {
            return Object.assign(Object.assign({}, setupMoves[0]), { reason: 'This move helps set up a future line' });
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
    findPotentialLineMoves(grid) {
        var _a;
        const moves = [];
        for (let fromX = 0; fromX < 9; fromX++) {
            for (let fromY = 0; fromY < 9; fromY++) {
                if (!grid[fromX][fromY])
                    continue;
                const from = { x: fromX, y: fromY };
                const ballColor = (_a = grid[fromX][fromY]) === null || _a === void 0 ? void 0 : _a.color;
                for (let toX = 0; toX < 9; toX++) {
                    for (let toY = 0; toY < 9; toY++) {
                        if (grid[toX][toY])
                            continue;
                        const to = { x: toX, y: toY };
                        const path = this.findPath(grid, from, to);
                        if (!path)
                            continue;
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
    findSetupMoves(grid) {
        var _a;
        const moves = [];
        for (let fromX = 0; fromX < 9; fromX++) {
            for (let fromY = 0; fromY < 9; fromY++) {
                if (!grid[fromX][fromY])
                    continue;
                const from = { x: fromX, y: fromY };
                const ballColor = (_a = grid[fromX][fromY]) === null || _a === void 0 ? void 0 : _a.color;
                for (let toX = 0; toX < 9; toX++) {
                    for (let toY = 0; toY < 9; toY++) {
                        if (grid[toX][toY])
                            continue;
                        const to = { x: toX, y: toY };
                        const path = this.findPath(grid, from, to);
                        if (!path)
                            continue;
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
    calculatePotential(grid, pos, color) {
        var _a, _b;
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
                if (x < 0 || x >= 9 || y < 0 || y >= 9 || !grid[x][y])
                    break;
                if (((_a = grid[x][y]) === null || _a === void 0 ? void 0 : _a.color) === color)
                    count++;
            }
            for (let i = 1; i < 5; i++) {
                const x = pos.x - dx * i;
                const y = pos.y - dy * i;
                if (x < 0 || x >= 9 || y < 0 || y >= 9 || !grid[x][y])
                    break;
                if (((_b = grid[x][y]) === null || _b === void 0 ? void 0 : _b.color) === color)
                    count++;
            }
            potential += count * count;
        }
        return potential;
    }
    findPath(grid, from, to) {
        const queue = [from];
        const visited = new Set([`${from.x},${from.y}`]);
        const parent = new Map();
        const directions = [
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
        ];
        while (queue.length > 0) {
            const current = queue.shift();
            if (current.x === to.x && current.y === to.y) {
                const path = [];
                let pos = to;
                while (pos.x !== from.x || pos.y !== from.y) {
                    path.push(pos);
                    const key = `${pos.x},${pos.y}`;
                    pos = parent.get(key);
                }
                path.push(from);
                return path.reverse();
            }
            for (const { dx, dy } of directions) {
                const nextX = current.x + dx;
                const nextY = current.y + dy;
                const key = `${nextX},${nextY}`;
                if (nextX >= 0 &&
                    nextX < 9 &&
                    nextY >= 0 &&
                    nextY < 9 &&
                    !visited.has(key) &&
                    (grid[nextX][nextY] === null || (nextX === to.x && nextY === to.y))) {
                    visited.add(key);
                    queue.push({ x: nextX, y: nextY });
                    parent.set(key, current);
                }
            }
        }
        return null;
    }
    checkLines(grid, pos) {
        var _a, _b, _c;
        const color = (_a = grid[pos.x][pos.y]) === null || _a === void 0 ? void 0 : _a.color;
        if (!color)
            return [];
        const directions = [
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 1, dy: 1 },
            { dx: 1, dy: -1 },
        ];
        const positionsToRemove = [];
        for (const { dx, dy } of directions) {
            const line = [{ x: pos.x, y: pos.y }];
            for (let i = 1; i < 9; i++) {
                const x = pos.x + dx * i;
                const y = pos.y + dy * i;
                if (x < 0 || x >= 9 || y < 0 || y >= 9 || ((_b = grid[x][y]) === null || _b === void 0 ? void 0 : _b.color) !== color)
                    break;
                line.push({ x, y });
            }
            for (let i = 1; i < 9; i++) {
                const x = pos.x - dx * i;
                const y = pos.y - dy * i;
                if (x < 0 || x >= 9 || y < 0 || y >= 9 || ((_c = grid[x][y]) === null || _c === void 0 ? void 0 : _c.color) !== color)
                    break;
                line.push({ x, y });
            }
            if (line.length >= 5) {
                positionsToRemove.push(...line);
            }
        }
        return Array.from(new Set(positionsToRemove.map((pos) => `${pos.x},${pos.y}`))).map((key) => {
            const [x, y] = key.split(',').map(Number);
            return { x, y };
        });
    }
};
exports.Line98Service = Line98Service;
exports.Line98Service = Line98Service = __decorate([
    (0, common_1.Injectable)()
], Line98Service);
//# sourceMappingURL=line98.service.js.map