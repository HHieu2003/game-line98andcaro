import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { GamesModel } from '../models/games.module';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GamesGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly gamesModel: GamesModel,
  ) {}

  async handleConnection(client: Socket) {
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
      console.log(
        `User ${payload.username} connected with userId ${payload.sub}`,
      );
    } catch (error) {
      console.error('Token verification failed:', error.message);
      client.disconnect();
    }
  }

  @SubscribeMessage('line98:init')
  handleLine98Init(client: Socket, payload: { userId: string }) {
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
    } else {
      client.emit('line98:error', { message: 'Failed to initialize game' });
    }
  }

  @SubscribeMessage('line98:move')
  handleLine98Move(
    client: Socket,
    payload: {
      userId: string;
      from: { x: number; y: number };
      to: { x: number; y: number };
    },
  ) {
    if (!client.data.user || client.data.user.userId !== payload.userId) {
      client.emit('line98:error', { message: 'Unauthorized' });
      return;
    }

    const { state, path, newBalls, exploded, preExplodeGrid, replacedPendingBall } =
      this.gamesModel.moveLine98Ball(payload.userId, payload.from, payload.to);

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

  @SubscribeMessage('line98:help')
  handleLine98Help(client: Socket, payload: { userId: string }) {
    if (!client.data.user || client.data.user.userId !== payload.userId) {
      client.emit('line98:error', { message: 'Unauthorized' });
      return;
    }
    const move = this.gamesModel.getLine98Help(payload.userId);
    client.emit('line98:help', move);
  }

  @SubscribeMessage('caro:join')
  handleCaroJoin(client: Socket, payload: { userId: string }) {
    if (!client.data.user || client.data.user.userId !== payload.userId) {
      client.emit('caro:error', { message: 'Unauthorized' });
      return;
    }
    const { gameId, symbol } = this.gamesModel.joinCaroGame(payload.userId);
    client.join(gameId);
    const game = this.gamesModel.getCaroGame(gameId);
    if (game) {
      this.server.to(gameId).emit('caro:state', game);
      console.log(
        `Player ${payload.userId} joined game ${gameId} as ${symbol}`,
      );
    } else {
      client.emit('caro:error', { message: 'Failed to join game' });
    }
  }

  @SubscribeMessage('caro:move')
  handleCaroMove(
    client: Socket,
    payload: { gameId: string; userId: string; x: number; y: number },
  ) {
    if (!client.data.user || client.data.user.userId !== payload.userId) {
      client.emit('caro:error', { message: 'Không được phép' });
      return;
    }
    const result = this.gamesModel.makeCaroMove(
      payload.gameId,
      payload.userId,
      payload.x,
      payload.y,
    );
    if (result.game) {
      this.server.to(payload.gameId).emit('caro:state', result.game);
    } else {
      client.emit('caro:error', {
        message: result.error || 'Nước đi không hợp lệ',
      });
    }
  }
}