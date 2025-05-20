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
exports.GamesModel = void 0;
const common_1 = require("@nestjs/common");
const caro_service_1 = require("./caro.service");
const line98_service_1 = require("./line98.service");
let GamesModel = class GamesModel {
    constructor(caroService, line98Service) {
        this.caroService = caroService;
        this.line98Service = line98Service;
    }
    joinCaroGame(userId) {
        return this.caroService.joinGame(userId);
    }
    makeCaroMove(gameId, userId, x, y) {
        return this.caroService.makeMove(gameId, userId, x, y);
    }
    getCaroGame(gameId) {
        return this.caroService.getGame(gameId);
    }
    initializeLine98Game(userId) {
        return this.line98Service.initializeGame(userId);
    }
    moveLine98Ball(userId, from, to) {
        return this.line98Service.move(userId, from, to);
    }
    getLine98Help(userId) {
        return this.line98Service.getHelp(userId);
    }
};
exports.GamesModel = GamesModel;
exports.GamesModel = GamesModel = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [caro_service_1.CaroService,
        line98_service_1.Line98Service])
], GamesModel);
//# sourceMappingURL=games.module.js.map