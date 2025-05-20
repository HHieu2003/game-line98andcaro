import { Controller, Get, Post, Body, Patch, UseGuards, Request } from '@nestjs/common';
import { UsersModel } from '../models/users.module';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { JwtAuthGuard } from '../gateways/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersModel: UsersModel) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersModel.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersModel.update(req.user.username, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersModel.findOne(req.user.username);
  }
}