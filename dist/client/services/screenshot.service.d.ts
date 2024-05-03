import { AppService, IVehicleProperties } from '@core-shared/interfaces';
export declare class ScreenshotService extends AppService {
    greenscreenEntity?: number;
    camera?: number;
    lastPosition?: number[];
    spawnedVehicle?: number;
    constructor();
    prepareGreenscreen(): Promise<void>;
    setVehicleProperties(vehicle: number, props: IVehicleProperties): void;
    spawnVehicle(name: string, props?: IVehicleProperties): Promise<void>;
    LoadDefaultModel(malePed: boolean, cb?: () => void): Promise<void>;
    setCoords(coords: number[]): Promise<void>;
    createClotheAsset(name: string): Promise<void>;
    destroy(): Promise<void>;
}
