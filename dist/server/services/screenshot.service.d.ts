import { AppService } from '@core-sv/interfaces';
export declare class ScreenshotService extends AppService {
    constructor();
    takeScreenshot(playerSrc: string, name: string, bucket: string): Promise<string>;
    processImage(path: string, name: string, bucket: string): Promise<string>;
}
