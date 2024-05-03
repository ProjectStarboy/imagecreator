import '@citizenfx/client';
import { ScreenshotController } from 'controllers/screenshot.controller';
import { App } from 'starboy-framework';
const client = App.create({
    controllers: [ScreenshotController],
});
client.start();
//# sourceMappingURL=client.js.map