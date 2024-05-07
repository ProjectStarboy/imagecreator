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
import { ICreateAssetPayload } from '../../shared/types/payload.type'

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
  /* @ChatCommand('takeclothe', "Take a screenshot of the vehicle you're in", [
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
  } */

  @Event('screenshot:takeScreenshot')
  async takeScreenshot(payload: ICreateAssetPayload, cb: any) {
    switch (payload.bucket) {
      case 'vehicles': {
        const url = await this.takeVehicle(
          payload.bucket,
          payload.name,
          payload.name,
          payload.props
        )
        return cb(url)
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
        return cb(response)
      }
      case 'owned_vehicles': {
        const url = await this.takeVehicle(
          payload.bucket,
          payload.name,
          payload.vehicleName,
          payload.props
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
