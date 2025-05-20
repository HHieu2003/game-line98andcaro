import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthModel } from '../models/auth.module';

@Controller('auth')
export class AuthController {
  constructor(private authModel: AuthModel) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    const user = await this.authModel.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authModel.login(user);
  }
}