import { AppController } from '@core-sv/interfaces/';
import { ScreenshotService } from 'services/screenshot.service';
export declare class ScreenshotController extends AppController {
    private readonly screenshotService;
    constructor(screenshotService: ScreenshotService);
    takeScreenshot(source: string, [name, bucket]: string[]): Promise<string>;
    switchBucket(source: string, isBack?: boolean): Promise<void>;
}
