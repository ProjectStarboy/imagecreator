import {
  AppService,
  IVehicleProperties,
  eVehicleModType,
} from '@core-shared/interfaces'
import { Sleep } from '@core-shared/utils'
import { Injectable } from 'starboy-framework'

const headCam = {
  camPos: [-1238.8529052734375, -3298.1806640625, 30.13855743408203],
  camRot: [-6.44125509262085, 0, 0.42932191491127014],
  camFov: 50,
}

const bodyCam = {
  camPos: [-1238.921142578125, -3299.453369140625, 29.91095733642578],
  camRot: [-11.376350402832031, 5.336084996088175e-8, -3.3868095874786377],
  camFov: 50,
}

const shoeCam = {
  camPos: [-1239.6722412109375, -3297.575439453125, 28.562721252441406],
  camRot: [-9.505410194396973, 0, -49.015228271484375],
  camFov: 40,
}

const legCam = {
  camPos: [-1239.333984375, -3299.25537109375, 29.21949577331543],
  camRot: [-9.215771675109863, -2.13443399843527e-7, -15.467365264892578],
  camFov: 60,
}

const Bones = {
  FB_R_Brow_Out_000: 1356,
  SKEL_L_Toe0: 2108,
  MH_R_Elbow: 2992,
  SKEL_L_Finger01: 4089,
  SKEL_L_Finger02: 4090,
  SKEL_L_Finger31: 4137,
  SKEL_L_Finger32: 4138,
  SKEL_L_Finger41: 4153,
  SKEL_L_Finger42: 4154,
  SKEL_L_Finger11: 4169,
  SKEL_L_Finger12: 4170,
  SKEL_L_Finger21: 4185,
  SKEL_L_Finger22: 4186,
  RB_L_ArmRoll: 5232,
  IK_R_Hand: 6286,
  RB_R_ThighRoll: 6442,
  SKEL_R_Clavicle: 10706,
  FB_R_Lip_Corner_000: 11174,
  SKEL_Pelvis: 11816,
  IK_Head: 12844,
  SKEL_L_Foot: 14201,
  MH_R_Knee: 16335,
  FB_LowerLipRoot_000: 17188,
  FB_R_Lip_Top_000: 17719,
  SKEL_L_Hand: 18905,
  FB_R_CheekBone_000: 19336,
  FB_UpperLipRoot_000: 20178,
  FB_L_Lip_Top_000: 20279,
  FB_LowerLip_000: 20623,
  SKEL_R_Toe0: 20781,
  FB_L_CheekBone_000: 21550,
  MH_L_Elbow: 22711,
  SKEL_Spine0: 23553,
  RB_L_ThighRoll: 23639,
  PH_R_Foot: 24806,
  SKEL_Spine1: 24816,
  SKEL_Spine2: 24817,
  SKEL_Spine3: 24818,
  FB_L_Eye_000: 25260,
  SKEL_L_Finger00: 26610,
  SKEL_L_Finger10: 26611,
  SKEL_L_Finger20: 26612,
  SKEL_L_Finger30: 26613,
  SKEL_L_Finger40: 26614,
  FB_R_Eye_000: 27474,
  SKEL_R_Forearm: 28252,
  PH_R_Hand: 28422,
  FB_L_Lip_Corner_000: 29868,
  SKEL_Head: 31086,
  IK_R_Foot: 35502,
  RB_Neck_1: 35731,
  IK_L_Hand: 36029,
  SKEL_R_Calf: 36864,
  RB_R_ArmRoll: 37119,
  FB_Brow_Centre_000: 37193,
  SKEL_Neck_1: 39317,
  SKEL_R_UpperArm: 40269,
  FB_R_Lid_Upper_000: 43536,
  RB_R_ForeArmRoll: 43810,
  SKEL_L_UpperArm: 45509,
  FB_L_Lid_Upper_000: 45750,
  MH_L_Knee: 46078,
  FB_Jaw_000: 46240,
  FB_L_Lip_Bot_000: 47419,
  FB_Tongue_000: 47495,
  FB_R_Lip_Bot_000: 49979,
  SKEL_R_Thigh: 51826,
  SKEL_R_Foot: 52301,
  IK_Root: 56604,
  SKEL_R_Hand: 57005,
  SKEL_Spine_Root: 57597,
  PH_L_Foot: 57717,
  SKEL_L_Thigh: 58271,
  FB_L_Brow_Out_000: 58331,
  SKEL_R_Finger00: 58866,
  SKEL_R_Finger10: 58867,
  SKEL_R_Finger20: 58868,
  SKEL_R_Finger30: 58869,
  SKEL_R_Finger40: 58870,
  PH_L_Hand: 60309,
  RB_L_ForeArmRoll: 61007,
  SKEL_L_Forearm: 61163,
  FB_UpperLip_000: 61839,
  SKEL_L_Calf: 63931,
  SKEL_R_Finger01: 64016,
  SKEL_R_Finger02: 64017,
  SKEL_R_Finger31: 64064,
  SKEL_R_Finger32: 64065,
  SKEL_R_Finger41: 64080,
  SKEL_R_Finger42: 64081,
  SKEL_R_Finger11: 64096,
  SKEL_R_Finger12: 64097,
  SKEL_R_Finger21: 64112,
  SKEL_R_Finger22: 64113,
  SKEL_L_Clavicle: 64729,
  FACIAL_facialRoot: 65068,
  IK_L_Foot: 65245,
}

const ScreenCoords = [-1238.91064453125, -3296.92822265625, 13.940055847167969]
@Injectable()
export class ScreenshotService extends AppService {
  greenscreenEntity?: number
  camera?: number
  lastPosition?: number[]
  spawnedVehicle?: number
  taking: boolean = false
  constructor() {
    super('ScreenshotService')
  }

  async prepareGreenscreen() {
    await Sleep(2000)
    const playerPed = PlayerPedId()
    this.lastPosition = GetEntityCoords(playerPed, true)
    emitNet('screenshot:switchBucket')
    DisplayRadar(false)
    if (GetResourceState('ProjectStarboy') === 'started') {
      exports['ProjectStarboy'].ExportController_ExecuteService(
        'PlayernameService',
        'toggle',
        false
      )
    }
    RequestCollisionAtCoord(ScreenCoords[0], ScreenCoords[1], ScreenCoords[2])

    SetEntityCoords(
      playerPed,
      ScreenCoords[0],
      ScreenCoords[1],
      ScreenCoords[2],
      true,
      false,
      false,
      true
    )
    while (!HasCollisionLoadedAroundEntity(playerPed)) {
      await Sleep(1)
    }
    const modelHash = GetHashKey('prop_big_cin_screen')
    RequestModel(modelHash)
    while (!HasModelLoaded(modelHash)) {
      await Sleep(1)
    }
    if (this.greenscreenEntity) {
      DeleteEntity(this.greenscreenEntity)
    }
    if (this.camera) {
      DestroyCam(this.camera, false)
    }
    this.greenscreenEntity = CreateObject(
      modelHash,
      ScreenCoords[0],
      ScreenCoords[1],
      ScreenCoords[2],
      false,
      false,
      false
    )
    SetEntityHeading(this.greenscreenEntity, 0.0)
    FreezeEntityPosition(this.greenscreenEntity, true)
    FreezeEntityPosition(playerPed, true)
    this.camera = CreateCamWithParams(
      'DEFAULT_SCRIPTED_CAMERA',
      ScreenCoords[0],
      ScreenCoords[1],
      ScreenCoords[2] + 10.0,
      0,
      0,
      0,
      60,
      true,
      2
    )
    SetCamActive(this.camera, true)
    RenderScriptCams(true, false, 0, true, false)
  }

  setVehicleProperties(vehicle: number, props: IVehicleProperties) {
    this.logInfo(props)
    this.logInfo(vehicle)
    this.logInfo(DoesEntityExist(vehicle))
    if (!DoesEntityExist(vehicle)) return
    ClearVehicleCustomPrimaryColour(vehicle)
    ClearVehicleCustomSecondaryColour(vehicle)
    SetVehicleModKit(vehicle, 0)
    if (props.wheels) {
      SetVehicleWheelType(vehicle, props.wheels)
    }
    if (props.health) {
      SetVehicleBodyHealth(vehicle, props.health + 0.0)
    }

    if (props.colorPrimary) {
      const [, colorSecondary] = GetVehicleColours(vehicle)
      SetVehicleColours(vehicle, props.colorPrimary, colorSecondary)
    }
    if (props.colorSecondary) {
      const [colorPrimary] = GetVehicleColours(vehicle)
      SetVehicleColours(vehicle, colorPrimary, props.colorSecondary)
    }
    if (props.customColorPrimary) {
      SetVehicleCustomPrimaryColour(
        vehicle,
        props.customColorPrimary.r,
        props.customColorPrimary.g,
        props.customColorPrimary.b
      )
    }
    if (props.customColorSecondary) {
      SetVehicleCustomPrimaryColour(
        vehicle,
        props.customColorSecondary.r,
        props.customColorSecondary.g,
        props.customColorSecondary.b
      )
    }

    if (props.extras) {
      props.extras.forEach((isOn, index) => {
        SetVehicleExtra(vehicle, index, isOn)
      })
    }
    if (props.mods) {
      if (props.mods.VMT_ARMOUR)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_ARMOUR,
          props.mods.VMT_ARMOUR,
          false
        )
      if (props.mods.VMT_BONNET)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_BONNET,
          props.mods.VMT_BONNET,
          false
        )
      if (props.mods.VMT_BRAKES)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_BRAKES,
          props.mods.VMT_BRAKES,
          false
        )
      if (props.mods.VMT_BUMPER_F)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_BUMPER_F,
          props.mods.VMT_BUMPER_F,
          false
        )
      if (props.mods.VMT_BUMPER_R)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_BUMPER_R,
          props.mods.VMT_BUMPER_R,
          false
        )
      if (props.mods.VMT_CHASSIS2)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_CHASSIS2,
          props.mods.VMT_CHASSIS2,
          false
        )
      if (props.mods.VMT_CHASSIS3)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_CHASSIS3,
          props.mods.VMT_CHASSIS3,
          false
        )
      if (props.mods.VMT_CHASSIS4)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_CHASSIS4,
          props.mods.VMT_CHASSIS4,
          false
        )
      if (props.mods.VMT_CHASSIS5)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_CHASSIS5,
          props.mods.VMT_CHASSIS5,
          false
        )
      if (props.mods.VMT_CHASSIS)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_CHASSIS,
          props.mods.VMT_CHASSIS,
          false
        )
      if (props.mods.VMT_DOOR_L)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_DOOR_L,
          props.mods.VMT_DOOR_L,
          false
        )
      if (props.mods.VMT_DOOR_R)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_DOOR_R,
          props.mods.VMT_DOOR_R,
          false
        )
      if (props.mods.VMT_ENGINE)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_ENGINE,
          props.mods.VMT_ENGINE,
          false
        )
      if (props.mods.VMT_ENGINEBAY1)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_ENGINEBAY1,
          props.mods.VMT_ENGINEBAY1,
          false
        )
      if (props.mods.VMT_ENGINEBAY2)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_ENGINEBAY2,
          props.mods.VMT_ENGINEBAY2,
          false
        )
      if (props.mods.VMT_ENGINEBAY3)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_ENGINEBAY3,
          props.mods.VMT_ENGINEBAY3,
          false
        )
      if (props.mods.VMT_EXHAUST)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_EXHAUST,
          props.mods.VMT_EXHAUST,
          false
        )
      if (props.mods.VMT_GEARBOX)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_GEARBOX,
          props.mods.VMT_GEARBOX,
          false
        )
      if (props.mods.VMT_GRILL)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_GRILL,
          props.mods.VMT_GRILL,
          false
        )
      if (props.mods.VMT_HORN)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_HORN,
          props.mods.VMT_HORN,
          false
        )
      if (props.mods.VMT_HYDRAULICS)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_HYDRAULICS,
          props.mods.VMT_HYDRAULICS,
          false
        )
      if (props.mods.VMT_HYDRO)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_HYDRO,
          props.mods.VMT_HYDRO,
          false
        )
      if (props.mods.VMT_ICE)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_ICE,
          props.mods.VMT_ICE,
          false
        )
      if (props.mods.VMT_INTERIOR1)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_INTERIOR1,
          props.mods.VMT_INTERIOR1,
          false
        )
      if (props.mods.VMT_INTERIOR2)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_INTERIOR2,
          props.mods.VMT_INTERIOR2,
          false
        )
      if (props.mods.VMT_INTERIOR3)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_INTERIOR3,
          props.mods.VMT_INTERIOR3,
          false
        )
      if (props.mods.VMT_INTERIOR4)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_INTERIOR4,
          props.mods.VMT_INTERIOR4,
          false
        )
      if (props.mods.VMT_CHASSIS5)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_CHASSIS5,
          props.mods.VMT_CHASSIS5,
          false
        )
      if (props.mods.VMT_KNOB)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_KNOB,
          props.mods.VMT_KNOB,
          false
        )
      if (props.mods.VMT_LIGHTBAR)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_LIGHTBAR,
          props.mods.VMT_LIGHTBAR,
          false
        )
      if (props.mods.VMT_LIVERY_MOD)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_LIVERY_MOD,
          props.mods.VMT_LIVERY_MOD,
          false
        )
      if (props.mods.VMT_NITROUS)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_NITROUS,
          props.mods.VMT_NITROUS,
          false
        )
      if (props.mods.VMT_PLAQUE)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_PLAQUE,
          props.mods.VMT_PLAQUE,
          false
        )
      if (props.mods.VMT_PLTHOLDER)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_PLTHOLDER,
          props.mods.VMT_PLTHOLDER,
          false
        )
      if (props.mods.VMT_PLTVANITY)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_PLTVANITY,
          props.mods.VMT_PLTVANITY,
          false
        )
      if (props.mods.VMT_ROOF)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_ROOF,
          props.mods.VMT_ROOF,
          false
        )
      if (props.mods.VMT_SEATS)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_SEATS,
          props.mods.VMT_SEATS,
          false
        )
      if (props.mods.VMT_SKIRT)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_SKIRT,
          props.mods.VMT_SKIRT,
          false
        )
      if (props.mods.VMT_SPOILER)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_SPOILER,
          props.mods.VMT_SPOILER,
          false
        )
      if (props.mods.VMT_STEERING)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_STEERING,
          props.mods.VMT_STEERING,
          false
        )
      if (props.mods.VMT_SUBWOOFER)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_SUBWOOFER,
          props.mods.VMT_SUBWOOFER,
          false
        )
      if (props.mods.VMT_SUSPENSION)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_SUSPENSION,
          props.mods.VMT_SUSPENSION,
          false
        )
      if (props.mods.VMT_TRUNK)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_TRUNK,
          props.mods.VMT_TRUNK,
          false
        )
      if (props.mods.VMT_TURBO)
        ToggleVehicleMod(
          vehicle,
          eVehicleModType.VMT_TURBO,
          props.mods.VMT_TURBO
        )
      if (props.mods.VMT_TYRE_SMOKE)
        ToggleVehicleMod(
          vehicle,
          eVehicleModType.VMT_TYRE_SMOKE,
          props.mods.VMT_TYRE_SMOKE
        )
      if (props.mods.VMT_WHEELS)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_WHEELS,
          props.mods.VMT_WHEELS,
          false
        )
      if (props.mods.VMT_WHEELS_REAR_OR_HYDRAULICS)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_WHEELS_REAR_OR_HYDRAULICS,
          props.mods.VMT_WHEELS_REAR_OR_HYDRAULICS,
          false
        )
      if (props.mods.VMT_WING_L)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_WING_L,
          props.mods.VMT_WING_L,
          false
        )
      if (props.mods.VMT_WING_R)
        SetVehicleMod(
          vehicle,
          eVehicleModType.VMT_WING_R,
          props.mods.VMT_WING_R,
          false
        )
      if (props.mods.VMT_XENON_LIGHTS)
        ToggleVehicleMod(
          vehicle,
          eVehicleModType.VMT_XENON_LIGHTS,
          props.mods.VMT_XENON_LIGHTS
        )
      if (props.mods.modLivery) {
        SetVehicleMod(vehicle, 48, props.mods.modLivery, false)
        SetVehicleLivery(vehicle, props.mods.modLivery)
      }
      if (props.neonEnabled) {
        props.neonEnabled.forEach((isEnable, index) => {
          SetVehicleNeonLightEnabled(vehicle, index, isEnable)
        })
      }
    }
    /* if (props.doorStatus) {
      props.doorStatus.forEach((isBroken, doorIndex) => {
        SetVehicleDoorBroken(vehicle, doorIndex, isBroken);
      });
    } */
    if (
      props.pearlescentColor !== undefined &&
      props.wheelColor !== undefined
    ) {
      SetVehicleExtraColours(vehicle, props.pearlescentColor, props.wheelColor)
    }
    if (props.windowStatus) {
      props.windowStatus.forEach((isIntact, doorIndex) => {
        if (!isIntact) {
          SmashVehicleWindow(vehicle, doorIndex)
        }
      })
    }
    if (props.tyreStatus) {
      props.tyreStatus.forEach((isBurst, wheelId) => {
        if (isBurst) {
          SetVehicleTyreBurst(vehicle, wheelId, true, 1000.0)
        }
      })
    }
    if (props.engineHealth) {
      this.logInfo(props.engineHealth)
      this.logInfo(typeof props.engineHealth)
      SetVehicleEngineHealth(vehicle, props.engineHealth + 0.0)
    }
    if (props.dirtLevel) {
      SetVehicleDirtLevel(vehicle, props.dirtLevel)
    }
  }

  async spawnVehicle(name: string, props?: IVehicleProperties) {
    await this.prepareGreenscreen()
    this.processingThread()
    if (!this.greenscreenEntity) return
    if (!this.camera) return
    const vehicleHash = GetHashKey(name)
    RequestModel(vehicleHash)
    while (!HasModelLoaded(vehicleHash)) {
      await Sleep(1)
    }
    if (this.spawnedVehicle) {
      DeleteEntity(this.spawnedVehicle)
    }
    const frontGreenscreen = GetOffsetFromEntityInWorldCoords(
      this.greenscreenEntity,
      0.0,
      -5.0,
      0.0
    )

    this.spawnedVehicle = CreateVehicle(
      vehicleHash,
      frontGreenscreen[0],
      frontGreenscreen[1],
      frontGreenscreen[2],
      0,
      false,
      false
    )
    SetEntityHeading(this.spawnedVehicle, 130.0)
    FreezeEntityPosition(this.spawnedVehicle, true)
    if (props) {
      this.setVehicleProperties(this.spawnedVehicle, props)
    }
    const camOffsetFromGreenScreen = GetOffsetFromEntityInWorldCoords(
      this.greenscreenEntity,
      0.0,
      -12.5,
      1.5
    )
    SetCamCoord(
      this.camera,
      camOffsetFromGreenScreen[0],
      camOffsetFromGreenScreen[1],
      camOffsetFromGreenScreen[2]
    )
    SetCamFov(this.camera, 40.0)
    PointCamAtEntity(this.camera, this.spawnedVehicle, 0.0, 0.0, 0.0, true)
    /* SetEntityCoords(
      PlayerPedId(),
      frontGreenscreen[0],
      frontGreenscreen[1],
      frontGreenscreen[2],
      true,
      false,
      false,
      true
    ) */
  }

  async LoadDefaultModel(malePed: boolean, cb?: () => void) {
    const playerPed = GetPlayerPed(-1)
    const characterModel = malePed
      ? GetHashKey('mp_m_freemode_01')
      : GetHashKey('mp_f_freemode_01')

    RequestModel(characterModel)

    while (!HasModelLoaded(characterModel)) {
      RequestModel(characterModel)
      await Sleep(0)
    }

    if (IsModelInCdimage(characterModel) && IsModelValid(characterModel)) {
      SetPlayerModel(PlayerId(), characterModel)
      SetPedDefaultComponentVariation(playerPed)
    }

    SetModelAsNoLongerNeeded(characterModel)

    if (cb) {
      cb()
    }
  }

  async setCoords(coords: number[]) {
    if (!coords) return
    const playerPed = PlayerPedId()
    SetEntityCoordsNoOffset(
      playerPed,
      coords[0],
      coords[1],
      coords[2],
      false,
      false,
      false
    )
    const time = GetGameTimer()
    while (
      !HasCollisionLoadedAroundEntity(playerPed) &&
      GetGameTimer() - time < 5000
    ) {
      RequestCollisionAtCoord(coords[0], coords[1], coords[2])
      await Sleep(0)
    }
    SetEntityCoordsNoOffset(
      playerPed,
      coords[0],
      coords[1],
      coords[2],
      false,
      false,
      false
    )
  }

  async createClotheAsset(
    gender: 'male' | 'female',
    type: 'component' | 'props',
    componentId: number,
    drawableId: number,
    textureId: number
  ) {
    console.log(
      'createClotheAsset',
      gender,
      type,
      componentId,
      drawableId,
      textureId
    )
    ClearOverrideWeather()
    ClearWeatherTypePersist()
    SetWeatherTypePersist('CLEAR')
    SetWeatherTypeNow('CLEAR')
    NetworkOverrideClockTime(12, 0, 0)
    PauseClock(true)
    DisplayRadar(false)
    if (GetResourceState('ProjectStarboy') === 'started') {
      exports['ProjectStarboy'].ExportController_ExecuteService(
        'PlayernameService',
        'toggle',
        false
      )
    }
    emitNet('screenshot:switchBucket')
    const playerPed = PlayerPedId()
    /* if (!gender || !componentId || !drawableId || !textureId) return */
    this.logInfo('createClotheAsset 2')
    this.lastPosition = GetEntityCoords(playerPed, true)
    await this.LoadDefaultModel(gender === 'male' ? true : false)
    SetPedComponentVariation(PlayerPedId(), 0, 1, 1, 0)
    await this.setCoords([
      -1238.91064453125, -3296.92822265625, 13.940055847167969,
    ])
    /* SetEntityCoords(
      playerPed,
      -1238.91064453125,
      -3296.92822265625,
      13.940055847167969,
      true,
      false,
      false,
      true
    ) */
    const modelHash = GetHashKey('prop_big_cin_screen')
    RequestModel(modelHash)
    while (!HasModelLoaded(modelHash)) {
      await Sleep(1)
    }
    if (this.greenscreenEntity) {
      DeleteEntity(this.greenscreenEntity)
    }
    if (this.camera) {
      DestroyCam(this.camera, false)
    }
    const playerCoords = GetEntityCoords(PlayerPedId(), true)
    this.logInfo(playerCoords)
    this.greenscreenEntity = CreateObject(
      modelHash,
      -1238.91064453125,
      -3296.92822265625,
      13.940055847167969,
      false,
      false,
      false
    )
    this.processingThread()
    SetEntityCoords(
      PlayerPedId(),
      -1238.9044189453125,
      -3296.92822265625,
      28.331361770629883,
      false,
      false,
      false,
      false
    )
    FreezeEntityPosition(PlayerPedId(), true)
    RequestAnimDict('mp_sleep')
    while (!HasAnimDictLoaded('mp_sleep')) {
      await Sleep(1)
    }
    TaskPlayAnim(
      PlayerPedId(),
      'mp_sleep',
      'bind_pose_180',
      999.0,
      999.0,
      -1,
      1,
      1,
      true,
      true,
      true
    )
    await Sleep(100)
    SetPedComponentVariation(PlayerPedId(), 1, -1, 0, 0)
    SetPedComponentVariation(PlayerPedId(), 3, -1, 0, 0)
    SetPedComponentVariation(PlayerPedId(), 4, -1, 0, 0)
    SetPedComponentVariation(PlayerPedId(), 6, -1, 0, 0)
    SetPedComponentVariation(PlayerPedId(), 8, -1, 0, 0)
    SetPedComponentVariation(PlayerPedId(), 11, -1, 0, 0)
    SetEntityHeading(PlayerPedId(), 180.0)
    switch (Number(componentId)) {
      case 0: {
        /* this.camera = World.createCamera(
          new Vector3(headCam.camPos[0], headCam.camPos[1], headCam.camPos[2]),
          new Vector3(headCam.camRot[0], headCam.camRot[1], headCam.camRot[2]),
          headCam.camFov
        )
        World.RenderingCamera = this.camera
        this.camera.pointAt(this.getBonePosition(Bone.SKEL_Head)) */
        this.camera = CreateCamWithParams(
          'DEFAULT_SCRIPTED_CAMERA',
          headCam.camPos[0],
          headCam.camPos[1],
          headCam.camPos[2],
          headCam.camRot[0],
          headCam.camRot[1],
          headCam.camRot[2],
          headCam.camFov,
          true,
          2
        )
        SetCamActive(this.camera, true)
        RenderScriptCams(true, false, 0, true, false)
        const bonePosition = GetPedBoneCoords(
          PlayerPedId(),
          Bones.SKEL_Head,
          0.0,
          0.0,
          0.0
        )
        PointCamAtCoord(
          this.camera,
          bonePosition[0],
          bonePosition[1],
          bonePosition[2]
        )
        break
      }
      case 1: {
        /* this.camera = World.createCamera(
          new Vector3(headCam.camPos[0], headCam.camPos[1], headCam.camPos[2]),
          new Vector3(headCam.camRot[0], headCam.camRot[1], headCam.camRot[2]),
          headCam.camFov
        )
        World.RenderingCamera = this.camera
        this.camera.pointAt(this.getBonePosition(Bone.SKEL_Head)) */
        this.camera = CreateCamWithParams(
          'DEFAULT_SCRIPTED_CAMERA',
          headCam.camPos[0],
          headCam.camPos[1],
          headCam.camPos[2],
          headCam.camRot[0],
          headCam.camRot[1],
          headCam.camRot[2],
          headCam.camFov,
          true,
          2
        )
        SetCamActive(this.camera, true)
        RenderScriptCams(true, false, 0, true, false)
        const bonePosition = GetPedBoneCoords(
          PlayerPedId(),
          Bones.SKEL_Head,
          0.0,
          0.0,
          0.0
        )
        PointCamAtCoord(
          this.camera,
          bonePosition[0],
          bonePosition[1],
          bonePosition[2]
        )
        break
      }
      case 2: {
        /* this.camera = World.createCamera(
          new Vector3(headCam.camPos[0], headCam.camPos[1], headCam.camPos[2]),
          new Vector3(headCam.camRot[0], headCam.camRot[1], headCam.camRot[2]),
          headCam.camFov
        )
        World.RenderingCamera = this.camera
        this.camera.pointAt(this.getBonePosition(Bone.SKEL_Head)) */
        this.camera = CreateCamWithParams(
          'DEFAULT_SCRIPTED_CAMERA',
          headCam.camPos[0],
          headCam.camPos[1],
          headCam.camPos[2],
          headCam.camRot[0],
          headCam.camRot[1],
          headCam.camRot[2],
          headCam.camFov,
          true,
          2
        )
        SetCamActive(this.camera, true)
        RenderScriptCams(true, false, 0, true, false)
        const bonePosition = GetPedBoneCoords(
          PlayerPedId(),
          Bones.SKEL_Head,
          0.0,
          0.0,
          0.0
        )
        PointCamAtCoord(
          this.camera,
          bonePosition[0],
          bonePosition[1],
          bonePosition[2]
        )
        break
      }
      case 3: {
        /* this.camera = World.createCamera(
          new Vector3(bodyCam.camPos[0], bodyCam.camPos[1], bodyCam.camPos[2]),
          new Vector3(bodyCam.camRot[0], bodyCam.camRot[1], bodyCam.camRot[2]),
          bodyCam.camFov
        )
        World.RenderingCamera = this.camera
        this.camera.pointAt(this.getBonePosition(Bone.SKEL_Spine3)) */
        this.camera = CreateCamWithParams(
          'DEFAULT_SCRIPTED_CAMERA',
          bodyCam.camPos[0],
          bodyCam.camPos[1],
          bodyCam.camPos[2],
          bodyCam.camRot[0],
          bodyCam.camRot[1],
          bodyCam.camRot[2],
          bodyCam.camFov,
          true,
          2
        )
        SetCamActive(this.camera, true)
        RenderScriptCams(true, false, 0, true, false)
        const bonePosition = GetPedBoneCoords(
          PlayerPedId(),
          Bones.SKEL_Spine3,
          0.0,
          0.0,
          0.0
        )
        PointCamAtCoord(
          this.camera,
          bonePosition[0],
          bonePosition[1],
          bonePosition[2]
        )
        break
      }
      case 4: {
        /* this.camera = World.createCamera(
          new Vector3(legCam.camPos[0], legCam.camPos[1], legCam.camPos[2]),
          new Vector3(legCam.camRot[0], legCam.camRot[1], legCam.camRot[2]),
          legCam.camFov
        )
        World.RenderingCamera = this.camera
        this.camera.pointAt(this.getBonePosition(Bone.SKEL_Spine_Root)) */
        this.camera = CreateCamWithParams(
          'DEFAULT_SCRIPTED_CAMERA',
          legCam.camPos[0],
          legCam.camPos[1],
          legCam.camPos[2],
          legCam.camRot[0],
          legCam.camRot[1],
          legCam.camRot[2],
          legCam.camFov,
          true,
          2
        )
        SetCamActive(this.camera, true)
        RenderScriptCams(true, false, 0, true, false)
        const bonePosition = GetPedBoneCoords(
          PlayerPedId(),
          Bones.SKEL_Spine3,
          0.0,
          0.0,
          0.0
        )
        PointCamAtCoord(
          this.camera,
          bonePosition[0],
          bonePosition[1],
          bonePosition[2]
        )
        break
      }
      case 5: {
        /* this.camera = World.createCamera(
          new Vector3(bodyCam.camPos[0], bodyCam.camPos[1], bodyCam.camPos[2]),
          new Vector3(bodyCam.camRot[0], bodyCam.camRot[1], bodyCam.camRot[2]),
          bodyCam.camFov
        )
        World.RenderingCamera = this.camera
        this.camera.pointAt(this.getBonePosition(Bone.SKEL_Spine3))
        this.playerService.player.Character.Heading = 0.0
        SetEntityHeading(PlayerPedId(), 0.0) */
        this.camera = CreateCamWithParams(
          'DEFAULT_SCRIPTED_CAMERA',
          bodyCam.camPos[0],
          bodyCam.camPos[1],
          bodyCam.camPos[2],
          bodyCam.camRot[0],
          bodyCam.camRot[1],
          bodyCam.camRot[2],
          bodyCam.camFov,
          true,
          2
        )
        SetEntityHeading(PlayerPedId(), 0.0)
        SetCamActive(this.camera, true)
        RenderScriptCams(true, false, 0, true, false)
        const bonePosition = GetPedBoneCoords(
          PlayerPedId(),
          Bones.SKEL_Spine3,
          0.0,
          0.0,
          0.0
        )
        PointCamAtCoord(
          this.camera,
          bonePosition[0],
          bonePosition[1],
          bonePosition[2]
        )
        break
      }
      case 6: {
        /* this.camera = World.createCamera(
          new Vector3(shoeCam.camPos[0], shoeCam.camPos[1], shoeCam.camPos[2]),
          new Vector3(shoeCam.camRot[0], shoeCam.camRot[1], shoeCam.camRot[2]),
          shoeCam.camFov
        )
        World.RenderingCamera = this.camera
        this.camera.pointAt(this.getBonePosition(Bone.SKEL_R_Foot)) */
        this.camera = CreateCamWithParams(
          'DEFAULT_SCRIPTED_CAMERA',
          shoeCam.camPos[0],
          shoeCam.camPos[1],
          shoeCam.camPos[2],
          shoeCam.camRot[0],
          shoeCam.camRot[1],
          shoeCam.camRot[2],
          shoeCam.camFov,
          true,
          2
        )
        SetCamActive(this.camera, true)
        RenderScriptCams(true, false, 0, true, false)
        const bonePosition = GetPedBoneCoords(
          PlayerPedId(),
          Bones.SKEL_R_Foot,
          0.0,
          0.0,
          0.0
        )
        PointCamAtCoord(
          this.camera,
          bonePosition[0],
          bonePosition[1],
          bonePosition[2]
        )
        break
      }

      case 7: {
        /* this.camera = World.createCamera(
          new Vector3(bodyCam.camPos[0], bodyCam.camPos[1], bodyCam.camPos[2]),
          new Vector3(bodyCam.camRot[0], bodyCam.camRot[1], bodyCam.camRot[2]),
          bodyCam.camFov
        )
        World.RenderingCamera = this.camera
        this.camera.pointAt(this.getBonePosition(Bone.SKEL_Spine3)) */
        this.camera = CreateCamWithParams(
          'DEFAULT_SCRIPTED_CAMERA',
          bodyCam.camPos[0],
          bodyCam.camPos[1],
          bodyCam.camPos[2],
          bodyCam.camRot[0],
          bodyCam.camRot[1],
          bodyCam.camRot[2],
          bodyCam.camFov,
          true,
          2
        )
        SetCamActive(this.camera, true)
        RenderScriptCams(true, false, 0, true, false)
        const bonePosition = GetPedBoneCoords(
          PlayerPedId(),
          Bones.SKEL_Spine3,
          0.0,
          0.0,
          0.0
        )
        PointCamAtCoord(
          this.camera,
          bonePosition[0],
          bonePosition[1],
          bonePosition[2]
        )
        break
      }
      case 8: {
        /* this.camera = World.createCamera(
          new Vector3(bodyCam.camPos[0], bodyCam.camPos[1], bodyCam.camPos[2]),
          new Vector3(bodyCam.camRot[0], bodyCam.camRot[1], bodyCam.camRot[2]),
          bodyCam.camFov
        )
        World.RenderingCamera = this.camera
        this.camera.pointAt(this.getBonePosition(Bone.SKEL_Spine3)) */
        this.camera = CreateCamWithParams(
          'DEFAULT_SCRIPTED_CAMERA',
          bodyCam.camPos[0],
          bodyCam.camPos[1],
          bodyCam.camPos[2],
          bodyCam.camRot[0],
          bodyCam.camRot[1],
          bodyCam.camRot[2],
          bodyCam.camFov,
          true,
          2
        )
        SetCamActive(this.camera, true)
        RenderScriptCams(true, false, 0, true, false)
        const bonePosition = GetPedBoneCoords(
          PlayerPedId(),
          Bones.SKEL_Spine3,
          0.0,
          0.0,
          0.0
        )
        PointCamAtCoord(
          this.camera,
          bonePosition[0],
          bonePosition[1],
          bonePosition[2]
        )
        break
      }
      case 9: {
        /* this.camera = World.createCamera(
          new Vector3(bodyCam.camPos[0], bodyCam.camPos[1], bodyCam.camPos[2]),
          new Vector3(bodyCam.camRot[0], bodyCam.camRot[1], bodyCam.camRot[2]),
          bodyCam.camFov
        )
        World.RenderingCamera = this.camera
        this.camera.pointAt(this.getBonePosition(Bone.SKEL_Spine3)) */
        this.camera = CreateCamWithParams(
          'DEFAULT_SCRIPTED_CAMERA',
          bodyCam.camPos[0],
          bodyCam.camPos[1],
          bodyCam.camPos[2],
          bodyCam.camRot[0],
          bodyCam.camRot[1],
          bodyCam.camRot[2],
          bodyCam.camFov,
          true,
          2
        )
        SetCamActive(this.camera, true)
        RenderScriptCams(true, false, 0, true, false)
        const bonePosition = GetPedBoneCoords(
          PlayerPedId(),
          Bones.SKEL_Spine3,
          0.0,
          0.0,
          0.0
        )
        PointCamAtCoord(
          this.camera,
          bonePosition[0],
          bonePosition[1],
          bonePosition[2]
        )
        break
      }
      case 10: {
        /* this.camera = World.createCamera(
          new Vector3(bodyCam.camPos[0], bodyCam.camPos[1], bodyCam.camPos[2]),
          new Vector3(bodyCam.camRot[0], bodyCam.camRot[1], bodyCam.camRot[2]),
          bodyCam.camFov
        )
        World.RenderingCamera = this.camera
        this.camera.pointAt(this.getBonePosition(Bone.SKEL_Spine3)) */
        this.camera = CreateCamWithParams(
          'DEFAULT_SCRIPTED_CAMERA',
          bodyCam.camPos[0],
          bodyCam.camPos[1],
          bodyCam.camPos[2],
          bodyCam.camRot[0],
          bodyCam.camRot[1],
          bodyCam.camRot[2],
          bodyCam.camFov,
          true,
          2
        )
        SetCamActive(this.camera, true)
        RenderScriptCams(true, false, 0, true, false)
        const bonePosition = GetPedBoneCoords(
          PlayerPedId(),
          Bones.SKEL_Spine3,
          0.0,
          0.0,
          0.0
        )
        PointCamAtCoord(
          this.camera,
          bonePosition[0],
          bonePosition[1],
          bonePosition[2]
        )
        break
      }
      case 11: {
        /* this.camera = World.createCamera(
          new Vector3(bodyCam.camPos[0], bodyCam.camPos[1], bodyCam.camPos[2]),
          new Vector3(bodyCam.camRot[0], bodyCam.camRot[1], bodyCam.camRot[2]),
          bodyCam.camFov
        )
        World.RenderingCamera = this.camera
        this.camera.pointAt(this.getBonePosition(Bone.SKEL_Spine3)) */
        this.camera = CreateCamWithParams(
          'DEFAULT_SCRIPTED_CAMERA',
          bodyCam.camPos[0],
          bodyCam.camPos[1],
          bodyCam.camPos[2],
          bodyCam.camRot[0],
          bodyCam.camRot[1],
          bodyCam.camRot[2],
          bodyCam.camFov,
          true,
          2
        )
        SetCamActive(this.camera, true)
        RenderScriptCams(true, false, 0, true, false)
        const bonePosition = GetPedBoneCoords(
          PlayerPedId(),
          Bones.SKEL_Spine3,
          0.0,
          0.0,
          0.0
        )
        PointCamAtCoord(
          this.camera,
          bonePosition[0],
          bonePosition[1],
          bonePosition[2]
        )
        break
      }

      default:
        break
    }
    if (!this.greenscreenEntity) return
    if (!this.camera) return
    if (
      IsPedComponentVariationValid(
        PlayerPedId(),
        Number(componentId),
        Number(drawableId),
        Number(textureId)
      )
    ) {
      SetPedPreloadVariationData(
        PlayerPedId(),
        Number(componentId),
        Number(drawableId),
        Number(textureId)
      )
      const curTime = GetGameTimer()
      while (
        !HasPedPreloadVariationDataFinished(PlayerPedId()) &&
        GetGameTimer() - curTime < 5000
      ) {
        await Sleep(100)
      }
      if (HasPedPreloadVariationDataFinished(PlayerPedId())) {
        SetPedComponentVariation(
          PlayerPedId(),
          Number(componentId),
          Number(drawableId),
          Number(textureId),
          0
        )
        await Sleep(100)
        /* await emitCallback(
          'devtool:savescreenshot',
          componentId.toString(),
          `${gender}_${componentId}_${drawableId}_${textureId}`
        ) */
      }
    }
  }

  async destroy() {
    if (this.greenscreenEntity) {
      DeleteEntity(this.greenscreenEntity)
      this.greenscreenEntity = undefined
    }
    if (this.spawnedVehicle) {
      DeleteEntity(this.spawnedVehicle)
      this.spawnedVehicle = undefined
    }
    if (this.camera) {
      RenderScriptCams(false, false, 0, true, false)
      DestroyCam(this.camera, false)
      this.camera = undefined
    }
    DisplayRadar(true)
    if (GetResourceState('ProjectStarboy') === 'started') {
      exports['ProjectStarboy'].ExportController_ExecuteService(
        'PlayernameService',
        'toggle',
        true
      )
    }
    if (this.lastPosition) {
      this.setCoords(this.lastPosition)
      this.lastPosition = undefined
    }
    FreezeEntityPosition(PlayerPedId(), false)
    emitNet('screenshot:switchBucket', true)
  }

  async processingThread() {
    while (this.greenscreenEntity) {
      await Sleep(0)
      HideHudComponentThisFrame(6)
      HideHudComponentThisFrame(7)
      HideHudComponentThisFrame(8)
      HideHudComponentThisFrame(9)
    }
  }
}
