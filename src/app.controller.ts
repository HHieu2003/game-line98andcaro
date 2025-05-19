import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Thêm import này
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

@Controller('config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get()
  getConfig() {
    return {
      NGROK_URL: this.configService.get('NGROK_URL') || 'http://localhost:3000'
    };
  }
}