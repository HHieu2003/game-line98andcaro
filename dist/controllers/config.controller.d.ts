import { ConfigService } from '@nestjs/config';
export declare class ConfigController {
    private configService;
    constructor(configService: ConfigService);
    getConfig(): {
        NGROK_URL: any;
    };
}
