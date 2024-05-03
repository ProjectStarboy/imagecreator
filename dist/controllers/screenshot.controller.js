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
    async takeVehicle(source, [name]) {
        this.logInfo('Taking vehicle screenshot...');
        await this.screenshotService.spawnVehicle(name);
        if (!name) {
            throw new Error('You must provide a name for the screenshot');
        }
        const response = await emitCallback('screenshot:takeScreenshot', [
            name,
            'vehicles',
        ]);
        this.logInfo(response);
        await this.screenshotService.destroy();
        return response;
    }
    async takeClothe(source, [name]) {
        this.logInfo('Taking clothe screenshot...');
        if (!name) {
            throw new Error('You must provide a name for the screenshot');
        }
        await this.screenshotService.createClotheAsset(name);
        const response = await emitCallback('screenshot:takeScreenshot', [
            name,
            'items',
        ]);
        this.logInfo(response);
        await this.screenshotService.destroy();
        return response;
    }
    async takeScreenshot({ bucket, name }, cb) {
        this.logInfo('Taking screenshot...', bucket, name);
        if (!name) {
            return cb('You must provide a name for the screenshot');
        }
        if (!bucket) {
            return cb('You must provide a bucket for the screenshot');
        }
        switch (bucket) {
            case 'vehicles': {
                const url = await this.takeVehicle(String(GetPlayerServerId(PlayerId())), [name]);
                return cb(url);
            }
            case 'items': {
                const url = await this.takeClothe(String(GetPlayerServerId(PlayerId())), [name]);
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
    ChatCommand('takevehicle', "Take a screenshot of the vehicle you're in", [
        { name: 'name', help: 'vehicle spawn name' },
    ]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], ScreenshotController.prototype, "takeVehicle", null);
__decorate([
    ChatCommand('takeclothe', "Take a screenshot of the vehicle you're in", [
        { name: 'name', help: 'vehicle spawn name' },
    ]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], ScreenshotController.prototype, "takeClothe", null);
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