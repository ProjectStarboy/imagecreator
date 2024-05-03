import "@citizenfx/server";
import { ScreenshotController } from "controllers/screenshot.controller";
import { App } from "starboy-framework";
const server = App.create({
    controllers: [ScreenshotController],
});
server.start();
//# sourceMappingURL=server.js.map