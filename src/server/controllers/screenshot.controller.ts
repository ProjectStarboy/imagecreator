import {
  ChatCommand,
  Controller,
  Inject,
  NetCallback,
  NetEvent,
} from 'starboy-framework'
import { AppController } from '@core-sv/interfaces/'
import { ScreenshotService } from 'services/screenshot.service'

@Controller()
export class ScreenshotController extends AppController {
  constructor(
    @Inject(ScreenshotService)
    private readonly screenshotService: ScreenshotService
  ) {
    super('ScreenshotController')
  }

  @NetCallback('screenshot:takeScreenshot')
  @ChatCommand('screenshot')
  async takeScreenshot(source: string, [name, bucket]: string[]) {
    this.logInfo('Taking screenshot...')
    if (!name) {
      throw new Error('You must provide a name for the screenshot')
    }
    if (!bucket) {
      throw new Error('You must provide a bucket for the screenshot')
    }
    const response = await this.screenshotService.takeScreenshot(
      source,
      name,
      bucket
    )
    return response
  }

  @NetEvent('screenshot:switchBucket')
  async switchBucket(source: string, isBack?: boolean) {
    if (isBack) {
      SetPlayerRoutingBucket(source, 0)
      return
    }
    SetPlayerRoutingBucket(source, Number(source))
  }
}
