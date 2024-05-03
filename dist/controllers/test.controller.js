import { __decorate, __metadata } from "tslib";
import { Controller } from 'starboy-framework';
import { AppController } from '@core-shared/interfaces';
let TestController = class TestController extends AppController {
    constructor() {
        super('TestController');
        /* setInterval(async () => {
          console.log('test');
          const response = await emitCallback<IResponse>('test');
          this.log(response);
        }, 1000); */
    }
};
TestController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [])
], TestController);
export { TestController };
//# sourceMappingURL=test.controller.js.map