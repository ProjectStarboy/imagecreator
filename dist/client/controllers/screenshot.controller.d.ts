import { AppController, ICreateAssetPayload, IVehicleProperties } from '@core-shared/interfaces/';
import { ScreenshotService } from 'services/screenshot.service';
export declare class ScreenshotController extends AppController {
    private readonly screenshotService;
    constructor(screenshotService: ScreenshotService);
    takeVehicle(bucket: string, name: string, vehicleName: string, props?: IVehicleProperties): Promise<string>;
    takeClothe(source: string, [name]: string[]): Promise<string>;
    takeScreenshot({ bucket, name, vehicleName, props }: ICreateAssetPayload, cb: any): Promise<any>;
    destroy(rsName: string): Promise<void>;
}
