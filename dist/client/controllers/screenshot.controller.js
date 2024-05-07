import { __decorate, __metadata, __param } from "tslib";
import { Controller, Event, Inject, } from 'starboy-framework';
import { AppController } from '@core-shared/interfaces/';
import { emitCallback } from 'utils/callback';
import { ScreenshotService } from 'services/screenshot.service';
let ScreenshotController = class ScreenshotController extends AppController {
    screenshotService;
    constructor(screenshotService) {
        super('ScreenshotController');
        this.screenshotService = screenshotService;
    }
    /* @ChatCommand('takevehicle', "Take a screenshot of the vehicle you're in", [
      { name: 'name', help: 'vehicle spawn name' },
    ]) */
    async takeVehicle(bucket, name, vehicleName, props) {
        this.logInfo('Taking vehicle screenshot...');
        await this.screenshotService.spawnVehicle(vehicleName, props);
        if (!vehicleName) {
            throw new Error('You must provide a name for the screenshot');
        }
        const response = await emitCallback('screenshot:takeScreenshot', [
            name,
            bucket,
        ]);
        this.logInfo(response);
        await this.screenshotService.destroy();
        return response;
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
    async takeScreenshot(payload, cb) {
        switch (payload.bucket) {
            case 'vehicles': {
                const url = await this.takeVehicle(payload.bucket, payload.name, payload.name, payload.props);
                return cb(url);
            }
            case 'items': {
                await this.screenshotService.createClotheAsset(payload.gender, payload.type, payload.componentId, payload.drawableId, payload.textureId);
                const response = await emitCallback('screenshot:takeScreenshot', [payload.name, payload.bucket]);
                this.logInfo(response);
                await this.screenshotService.destroy();
                if (GetResourceState('ox_inventory') === 'started') {
                    exports.ox_inventory.refreshPlayerClothing();
                }
                return cb(response);
            }
            case 'owned_vehicles': {
                const url = await this.takeVehicle(payload.bucket, payload.name, payload.vehicleName, payload.props);
                return cb(url);
            }
            default:
                break;
        }
    }
    async destroy(rsName) {
        if (rsName !== GetCurrentResourceName())
            return;
        await this.screenshotService.destroy();
    }
};
__decorate([
    Event('screenshot:takeScreenshot'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScreenshotController.prototype, "takeScreenshot", null);
__decorate([
    Event('onResourceStop'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScreenshotController.prototype, "destroy", null);
ScreenshotController = __decorate([
    Controller(),
    __param(0, Inject(ScreenshotService)),
    __metadata("design:paramtypes", [ScreenshotService])
], ScreenshotController);
export { ScreenshotController };
//# sourceMappingURL=screenshot.controller.js.map