import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  
  const port = configService.get<number>('PORT') || 3000;
  const ngrokUrl = configService.get<string>('NGROK_URL') || `http://localhost:${port}`;

  // Enable CORS
  app.enableCors({
    origin: '*', // Hoặc chỉ định origin cụ thể, ví dụ: 'http://localhost:3000'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useStaticAssets(join(__dirname, '..', 'client'));

  await app.listen(port);
  console.log(`Server running on: ${ngrokUrl}`);
}
bootstrap();