import { AppController, IVehicleProperties } from '@core-shared/interfaces/';
import { ScreenshotService } from 'services/screenshot.service';
import { ICreateAssetPayload } from '../../shared/types/payload.type';
export declare class ScreenshotController extends AppController {
    private readonly screenshotService;
    taking: boolean;
    constructor(screenshotService: ScreenshotService);
    takeVehicle(bucket: string, name: string, vehicleName: string, props?: IVehicleProperties): Promise<string>;
    testScreenShot(source: any, args: string[], rawCommand: string): Promise<void>;
    timeThread(): Promise<void>;
    takeScreenshot(payload: ICreateAssetPayload, cb?: (url: string) => void): Promise<string | undefined>;
    destroy(rsName: string): Promise<void>;
}
