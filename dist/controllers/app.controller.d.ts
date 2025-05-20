import { AppService } from '../app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getHome(): {
        message: string;
    };
    getLoginPage(): {};
    getRegisterPage(): {};
    getIndexPage(): {
        message: string;
    };
}
