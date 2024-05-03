import {
  ChatCommand,
  Controller,
  Event,
  Inject,
  NuiHandler,
} from 'starboy-framework'
import {
  AppController,
  ICreateAssetPayload,
  IVehicleProperties,
} from '@core-shared/interfaces/'
import { emitCallback } from 'utils/callback'
import { ScreenshotService } from 'services/screenshot.service'

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
  @ChatCommand('takeclothe', "Take a screenshot of the vehicle you're in", [
    { name: 'name', help: 'vehicle spawn name' },
  ])
  async takeClothe(source: string, [name]: string[]) {
    this.logInfo('Taking clothe screenshot...')

    if (!name) {
      throw new Error('You must provide a name for the screenshot')
    }
    await this.screenshotService.createClotheAsset(name)
    const response = await emitCallback<string>('screenshot:takeScreenshot', [
      name,
      'items',
    ])
    this.logInfo(response)
    await this.screenshotService.destroy()
    return response
  }

  @Event('screenshot:takeScreenshot')
  async takeScreenshot(
    { bucket, name, vehicleName, props }: ICreateAssetPayload,
    cb: any
  ) {
    this.logInfo('Taking screenshot...', bucket, name)
    if (!name) {
      return cb('You must provide a name for the screenshot')
    }
    if (!bucket) {
      return cb('You must provide a bucket for the screenshot')
    }
    switch (bucket) {
      case 'vehicles': {
        const url = await this.takeVehicle(
          bucket,
          name,
          vehicleName || name,
          props
        )
        return cb(url)
      }
      case 'items': {
        const url = await this.takeClothe(
          String(GetPlayerServerId(PlayerId())),
          [name]
        )
        return cb(url)
      }
      case 'owned_vehicles': {
        const url = await this.takeVehicle(
          bucket,
          name,
          vehicleName || name,
          props
        )
        return cb(url)
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
