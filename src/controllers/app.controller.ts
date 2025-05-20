import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from '../app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  @Render('index')
  getHome() {
    return { message: 'Welcome!' };
  }

  @Get('login')
  @Render('login')
  getLoginPage() {
    return {};
  }

  @Get('register') // ✅ Sửa đúng cú pháp
  @Render('register')
  getRegisterPage() {
    return {};
  }

  @Get('index')
@Render('index')
getIndexPage() {
  return { message: 'Welcome!' };
}

}
