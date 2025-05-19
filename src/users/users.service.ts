import { Injectable, ConflictException, NotFoundException,UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ ...createUserDto, password: hashedPassword });
    return user.save();
  }

  async findOne(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

   async update(username: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findOne({ username });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra mật khẩu hiện tại nếu muốn đổi mật khẩu
    if (updateUserDto.newPassword) {
      if (!updateUserDto.currentPassword) {
        throw new UnauthorizedException('Phải nhập mật khẩu hiện tại');
      }

      const isPasswordValid = await bcrypt.compare(
        updateUserDto.currentPassword, 
        user.password
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
      }

      // Mã hóa mật khẩu mới
      user.password = await bcrypt.hash(updateUserDto.newPassword, 10);
    }

    // Cập nhật các thông tin khác
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.age) user.age = updateUserDto.age;

    return user.save();
  }
}