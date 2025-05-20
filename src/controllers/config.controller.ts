import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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