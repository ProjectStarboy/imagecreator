import { AppController, IVehicleProperties } from '@core-shared/interfaces/';
import { ScreenshotService } from 'services/screenshot.service';
import { ICreateAssetPayload } from '../../shared/types/payload.type';
export declare class ScreenshotController extends AppController {
    private readonly screenshotService;
    constructor(screenshotService: ScreenshotService);
    takeVehicle(bucket: string, name: string, vehicleName: string, props?: IVehicleProperties): Promise<string>;
    takeScreenshot(payload: ICreateAssetPayload, cb: any): Promise<any>;
    destroy(rsName: string): Promise<void>;
}
