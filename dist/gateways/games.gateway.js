"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const games_module_1 = require("../models/games.module");
let GamesGateway = class GamesGateway {
    constructor(jwtService, gamesModel) {
        this.jwtService = jwtService;
        this.gamesModel = gamesModel;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token;
            console.log('Received token on server:', token);
            if (!token) {
                console.error('No token provided, disconnecting client');
                client.disconnect();
                return;
            }
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            console.log('Token payload:', payload);
            client.data.user = { username: payload.username, userId: payload.sub };
            console.log(`User ${payload.username} connected with userId ${payload.sub}`);
        }
        catch (error) {
            console.error('Token verification failed:', error.message);
            client.disconnect();
        }
    }
    handleLine98Init(client, payload) {
        if (!client.data.user || client.data.user.userId !== payload.userId) {
            client.emit('line98:error', { message: 'Unauthorized' });
            return;
        }
        const result = this.gamesModel.initializeLine98Game(payload.userId);
        if (result) {
            client.emit('line98:state', {
                state: result.state,
                path: null,
                newBalls: result.pendingBalls,
            });
            console.log(`Sent initial state for user ${payload.userId}`);
        }
        else {
            client.emit('line98:error', { message: 'Failed to initialize game' });
        }
    }
    handleLine98Move(client, payload) {
        if (!client.data.user || client.data.user.userId !== payload.userId) {
            client.emit('line98:error', { message: 'Unauthorized' });
            return;
        }
        const { state, path, newBalls, exploded, preExplodeGrid, replacedPendingBall } = this.gamesModel.moveLine98Ball(payload.userId, payload.from, payload.to);
        if (state) {
            client.emit('line98:state', {
                state,
                path,
                newBalls,
                exploded,
                preExplodeGrid,
                replacedPendingBall
            });
        }
    }
    handleLine98Help(client, payload) {
        if (!client.data.user || client.data.user.userId !== payload.userId) {
            client.emit('line98:error', { message: 'Unauthorized' });
            return;
        }
        const move = this.gamesModel.getLine98Help(payload.userId);
        client.emit('line98:help', move);
    }
    handleCaroJoin(client, payload) {
        if (!client.data.user || client.data.user.userId !== payload.userId) {
            client.emit('caro:error', { message: 'Unauthorized' });
            return;
        }
        const { gameId, symbol } = this.gamesModel.joinCaroGame(payload.userId);
        client.join(gameId);
        const game = this.gamesModel.getCaroGame(gameId);
        if (game) {
            this.server.to(gameId).emit('caro:state', game);
            console.log(`Player ${payload.userId} joined game ${gameId} as ${symbol}`);
        }
        else {
            client.emit('caro:error', { message: 'Failed to join game' });
        }
    }
    handleCaroMove(client, payload) {
        if (!client.data.user || client.data.user.userId !== payload.userId) {
            client.emit('caro:error', { message: 'Không được phép' });
            return;
        }
        const result = this.gamesModel.makeCaroMove(payload.gameId, payload.userId, payload.x, payload.y);
        if (result.game) {
            this.server.to(payload.gameId).emit('caro:state', result.game);
        }
        else {
            client.emit('caro:error', {
                message: result.error || 'Nước đi không hợp lệ',
            });
        }
    }
};
exports.GamesGateway = GamesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GamesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('line98:init'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GamesGateway.prototype, "handleLine98Init", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('line98:move'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GamesGateway.prototype, "handleLine98Move", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('line98:help'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GamesGateway.prototype, "handleLine98Help", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('caro:join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GamesGateway.prototype, "handleCaroJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('caro:move'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GamesGateway.prototype, "handleCaroMove", null);
exports.GamesGateway = GamesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        games_module_1.GamesModel])
], GamesGateway);
//# sourceMappingURL=games.gateway.js.map