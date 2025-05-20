"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaroService = void 0;
const common_1 = require("@nestjs/common");
let CaroService = class CaroService {
    constructor() {
        this.BOARD_SIZE = 30;
        this.WIN_CONDITION = 5;
        this.games = new Map();
    }
    joinGame(userId) {
        let gameId = null;
        for (const [id, game] of this.games) {
            if (game.status === 'waiting' && game.players.length === 1) {
                if (game.players.some(p => p.userId === userId)) {
                    return { gameId: id, symbol: game.players.find(p => p.userId === userId).symbol };
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
        return { gameId, symbol: this.games.get(gameId).players.find(p => p.userId === userId).symbol };
    }
    makeMove(gameId, userId, x, y) {
        var _a;
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
            game.winner = ((_a = game.players.find(p => p.symbol === winner)) === null || _a === void 0 ? void 0 : _a.userId) || null;
            console.log(`Game ${gameId} finished, winner: ${game.winner}`);
        }
        else if (game.board.every(row => row.every(cell => cell))) {
            game.status = 'finished';
            game.winner = null;
            console.log(`Game ${gameId} finished, draw`);
        }
        return { game };
    }
    getGame(gameId) {
        return this.games.get(gameId) || null;
    }
    checkWinner(board) {
        const directions = [
            [0, 1],
            [1, 0],
            [1, 1],
            [1, -1],
        ];
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                const current = board[i][j];
                if (!current)
                    continue;
                for (const [dx, dy] of directions) {
                    let count = 1;
                    let x = i + dx;
                    let y = j + dy;
                    while (x >= 0 && x < this.BOARD_SIZE &&
                        y >= 0 && y < this.BOARD_SIZE &&
                        board[x][y] === current) {
                        count++;
                        if (count === this.WIN_CONDITION)
                            return current;
                        x += dx;
                        y += dy;
                    }
                }
            }
        }
        return null;
    }
};
exports.CaroService = CaroService;
exports.CaroService = CaroService = __decorate([
    (0, common_1.Injectable)()
], CaroService);
//# sourceMappingURL=caro.service.js.map