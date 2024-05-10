import { IVehicleProperties } from '@core-shared/interfaces'

export interface ICreateAssetVehicle {
  targetType: 'vehicle'
  bucket: string
  name: string
  props?: IVehicleProperties
}

export interface ICreateAssetOwnedVehicle {
  targetType: 'owned_vehicles'
  bucket: string
  name: string
  vehicleName: string
  props: IVehicleProperties
}

export interface ICreateAssetClothe {
  targetType: 'clothe'
  bucket: string
  type: 'component' | 'props'
  componentId: number
  drawableId: number
  textureId: number
  name: string
  gender: 'male' | 'female'
}

export type ICreateAssetPayload =
  | ICreateAssetVehicle
  | ICreateAssetClothe
  | ICreateAssetOwnedVehicle
