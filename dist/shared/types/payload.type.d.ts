import { IVehicleProperties } from '@core-shared/interfaces';
export interface ICreateAssetVehicle {
    bucket: 'vehicles';
    name: string;
    props?: IVehicleProperties;
}
export interface ICreateAssetOwnedVehicle {
    bucket: 'owned_vehicles';
    name: string;
    vehicleName: string;
    props: IVehicleProperties;
}
export interface ICreateAssetClothe {
    bucket: 'items';
    type: 'component' | 'props';
    componentId: number;
    drawableId: number;
    textureId: number;
    name: string;
    gender: 'male' | 'female';
}
export type ICreateAssetPayload = ICreateAssetVehicle | ICreateAssetClothe | ICreateAssetOwnedVehicle;
