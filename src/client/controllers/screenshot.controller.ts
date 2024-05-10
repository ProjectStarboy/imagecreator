import {
  ChatCommand,
  Controller,
  Event,
  Inject,
  NuiHandler,
} from 'starboy-framework'
import { AppController, IVehicleProperties } from '@core-shared/interfaces/'
import { emitCallback } from 'utils/callback'
import { ScreenshotService } from 'services/screenshot.service'
import {
  ICreateAssetClothe,
  ICreateAssetPayload,
  ICreateAssetVehicle,
} from '../../shared/types/payload.type'

@Controller()
export class ScreenshotController extends AppController {
  constructor(
    @Inject(ScreenshotService)
    private readonly screenshotService: ScreenshotService
  ) {
    super('ScreenshotController')
  }

  /* @ChatCommand('takevehicle', "Take a screenshot of the vehicle you're in", [
    { name: 'name', help: 'vehicle spawn name' },
  ]) */

  async takeVehicle(
    bucket: string,
    name: string,
    vehicleName: string,
    props?: IVehicleProperties
  ) {
    this.logInfo('Taking vehicle screenshot...')

    await this.screenshotService.spawnVehicle(vehicleName, props)
    if (!vehicleName) {
      throw new Error('You must provide a name for the screenshot')
    }
    const response = await emitCallback<string>('screenshot:takeScreenshot', [
      name,
      bucket,
    ])
    this.logInfo(response)
    await this.screenshotService.destroy()
    return response
  }

  @ChatCommand('testscreenshot', "Take a screenshot of the vehicle you're in", [
    {
      name: 'targetType',
      help: 'vehicle | clothe | owned_vehicles',
    },
    {
      name: 'bucket',
      help: 'Bucket of the screenshot',
    },
    {
      name: 'name',
      help: 'Name of the screenshot',
    },
    {
      name: 'vehicleName',
      help: 'Vehicle name',
    },
    {
      name: 'type',
      help: 'component | props | vehicle',
    },
    {
      name: 'componentId',
      help: 'Component ID',
    },
    {
      name: 'drawableId',
      help: 'Drawable ID',
    },
    {
      name: 'textureId',
      help: 'Texture ID',
    },
    {
      name: 'gender',
      help: 'gender',
    },
  ])
  async testScreenShot(source: any, args: string[], rawCommand: string) {
    const targetType = args[0]
    const bucket = args[1]
    if (!targetType) return
    switch (targetType) {
      case 'vehicle': {
        const data: ICreateAssetVehicle = {
          targetType: 'vehicle',
          bucket,
          name: args[2],
        }
        const url = this.takeScreenshot(data)
        this.logInfo(url)
        return
      }
      case 'clothe': {
        const data: ICreateAssetClothe = {
          targetType: 'clothe',
          bucket,
          type: args[4] as ICreateAssetClothe['type'],
          componentId: Number(args[5]),
          drawableId: Number(args[6]),
          textureId: Number(args[7]),
          name: args[2],
          gender: args[8] as ICreateAssetClothe['gender'],
        }
        const url = this.takeScreenshot(data)
        this.logInfo(url)
      }
    }
  }

  @Event('screenshot:takeScreenshot')
  async takeScreenshot(
    payload: ICreateAssetPayload,
    cb?: (url: string) => void
  ) {
    TriggerScreenblurFadeOut(0)
    switch (payload.targetType) {
      case 'vehicle': {
        const url = await this.takeVehicle(
          payload.bucket,
          payload.name,
          payload.name,
          payload.props
        )
        if (cb) cb(url)
        return url
      }
      case 'clothe': {
        await this.screenshotService.createClotheAsset(
          payload.gender,
          payload.type,
          payload.componentId,
          payload.drawableId,
          payload.textureId
        )
        const response = await emitCallback<string>(
          'screenshot:takeScreenshot',
          [payload.name, payload.bucket]
        )
        this.logInfo(response)
        await this.screenshotService.destroy()
        if (GetResourceState('ox_inventory') === 'started') {
          exports.ox_inventory.refreshPlayerClothing()
        }
        if (cb) cb(response)
        return response
      }
      case 'owned_vehicles': {
        const url = await this.takeVehicle(
          payload.bucket,
          payload.name,
          payload.vehicleName,
          payload.props
        )
        if (cb) cb(url)
        return url
      }
      default:
        break
    }
  }

  @Event('onResourceStop')
  async destroy(rsName: string) {
    if (rsName !== GetCurrentResourceName()) return
    await this.screenshotService.destroy()
  }
}
