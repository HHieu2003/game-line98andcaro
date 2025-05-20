import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { GamesModel } from '../models/games.module';
export declare class GamesGateway {
    private readonly jwtService;
    private readonly gamesModel;
    server: Server;
    constructor(jwtService: JwtService, gamesModel: GamesModel);
    handleConnection(client: Socket): Promise<void>;
    handleLine98Init(client: Socket, payload: {
        userId: string;
    }): void;
    handleLine98Move(client: Socket, payload: {
        userId: string;
        from: {
            x: number;
            y: number;
        };
        to: {
            x: number;
            y: number;
        };
    }): void;
    handleLine98Help(client: Socket, payload: {
        userId: string;
    }): void;
    handleCaroJoin(client: Socket, payload: {
        userId: string;
    }): void;
    handleCaroMove(client: Socket, payload: {
        gameId: string;
        userId: string;
        x: number;
        y: number;
    }): void;
}
