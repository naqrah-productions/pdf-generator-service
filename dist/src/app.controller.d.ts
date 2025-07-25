import { Response } from 'express';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getGeneratedPdf(data: any, res: Response): Promise<void>;
}
