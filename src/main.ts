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

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setViewEngine('hbs'); // Sử dụng Handlebars
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));


  await app.listen(port);
  console.log(`Server running on: ${ngrokUrl}`);
}
bootstrap();