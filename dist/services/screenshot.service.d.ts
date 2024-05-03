import { AppService } from '@core-shared/interfaces';
export declare class ScreenshotService extends AppService {
    greenscreenEntity?: number;
    camera?: number;
    lastPosition?: number[];
    spawnedVehicle?: number;
    constructor();
    prepareGreenscreen(): Promise<void>;
    spawnVehicle(name: string): Promise<void>;
    LoadDefaultModel(malePed: boolean, cb?: () => void): Promise<void>;
    setCoords(coords: number[]): Promise<void>;
    createClotheAsset(name: string): Promise<void>;
    destroy(): Promise<void>;
}
