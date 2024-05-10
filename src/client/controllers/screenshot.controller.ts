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
    const bucket = args[0]
    if (!bucket) return
    switch (bucket) {
      case 'vehicles': {
        const data: ICreateAssetVehicle = {
          bucket: 'vehicles',
          name: args[1],
        }
        const url = this.takeScreenshot(data)
        this.logInfo(url)
        return
      }
      case 'items': {
        const data: ICreateAssetClothe = {
          bucket: 'items',
          type: args[3] as ICreateAssetClothe['type'],
          componentId: Number(args[4]),
          drawableId: Number(args[5]),
          textureId: Number(args[6]),
          name: args[1],
          gender: args[7] as ICreateAssetClothe['gender'],
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
    switch (payload.bucket) {
      case 'vehicles': {
        const url = await this.takeVehicle(
          payload.bucket,
          payload.name,
          payload.name,
          payload.props
        )
        if (cb) cb(url)
        return url
      }
      case 'items': {
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
