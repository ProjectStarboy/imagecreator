import { __awaiter, __decorate, __metadata, __param } from "tslib";
import { ChatCommand, Controller, Inject, NetCallback, NetEvent, } from 'starboy-framework';
import { AppController } from '@core-sv/interfaces/';
import { ScreenshotService } from 'services/screenshot.service';
let ScreenshotController = class ScreenshotController extends AppController {
    constructor(screenshotService) {
        super('ScreenshotController');
        this.screenshotService = screenshotService;
    }
    takeScreenshot(source, [name, bucket]) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logInfo('Taking screenshot...');
            if (!name) {
                throw new Error('You must provide a name for the screenshot');
            }
            if (!bucket) {
                throw new Error('You must provide a bucket for the screenshot');
            }
            const response = yield this.screenshotService.takeScreenshot(source, name, bucket);
            return response;
        });
    }
    switchBucket(source, isBack) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isBack) {
                SetPlayerRoutingBucket(source, 0);
                return;
            }
            SetPlayerRoutingBucket(source, Number(source));
        });
    }
};
__decorate([
    NetCallback('screenshot:takeScreenshot'),
    ChatCommand('screenshot'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], ScreenshotController.prototype, "takeScreenshot", null);
__decorate([
    NetEvent('screenshot:switchBucket'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], ScreenshotController.prototype, "switchBucket", null);
ScreenshotController = __decorate([
    Controller(),
    __param(0, Inject(ScreenshotService)),
    __metadata("design:paramtypes", [ScreenshotService])
], ScreenshotController);
export { ScreenshotController };
//# sourceMappingURL=screenshot.controller.js.map