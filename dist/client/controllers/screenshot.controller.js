import { __decorate, __metadata, __param } from "tslib";
import { ChatCommand, Controller, Event, Inject, } from 'starboy-framework';
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
    async testScreenShot(source, args, rawCommand) {
        const bucket = args[0];
        if (!bucket)
            return;
        switch (bucket) {
            case 'vehicles': {
                const data = {
                    bucket: 'vehicles',
                    name: args[1],
                };
                const url = this.takeScreenshot(data);
                this.logInfo(url);
                return;
            }
            case 'items': {
                const data = {
                    bucket: 'items',
                    type: args[3],
                    componentId: Number(args[4]),
                    drawableId: Number(args[5]),
                    textureId: Number(args[6]),
                    name: args[1],
                    gender: args[7],
                };
                const url = this.takeScreenshot(data);
                this.logInfo(url);
            }
        }
    }
    async takeScreenshot(payload, cb) {
        switch (payload.bucket) {
            case 'vehicles': {
                const url = await this.takeVehicle(payload.bucket, payload.name, payload.name, payload.props);
                if (cb)
                    cb(url);
                return url;
            }
            case 'items': {
                await this.screenshotService.createClotheAsset(payload.gender, payload.type, payload.componentId, payload.drawableId, payload.textureId);
                const response = await emitCallback('screenshot:takeScreenshot', [payload.name, payload.bucket]);
                this.logInfo(response);
                await this.screenshotService.destroy();
                if (GetResourceState('ox_inventory') === 'started') {
                    exports.ox_inventory.refreshPlayerClothing();
                }
                if (cb)
                    cb(response);
                return response;
            }
            case 'owned_vehicles': {
                const url = await this.takeVehicle(payload.bucket, payload.name, payload.vehicleName, payload.props);
                if (cb)
                    cb(url);
                return url;
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
    ChatCommand('testscreenshot', "Take a screenshot of the vehicle you're in", [
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
    ]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, String]),
    __metadata("design:returntype", Promise)
], ScreenshotController.prototype, "testScreenShot", null);
__decorate([
    Event('screenshot:takeScreenshot'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
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