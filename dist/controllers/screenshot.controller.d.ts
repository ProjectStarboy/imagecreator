import { AppController } from '@core-shared/interfaces/';
import { ScreenshotService } from 'services/screenshot.service';
export declare class ScreenshotController extends AppController {
    private readonly screenshotService;
    constructor(screenshotService: ScreenshotService);
    takeVehicle(source: string, [name]: string[]): Promise<string>;
    takeClothe(source: string, [name]: string[]): Promise<string>;
    takeScreenshot({ bucket, name }: {
        bucket: string;
        name: string;
    }, cb: any): Promise<any>;
    destroy(rsName: string): Promise<void>;
}
