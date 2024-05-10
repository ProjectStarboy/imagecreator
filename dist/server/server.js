var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);

// src/server/server.ts
var import_server = require("@citizenfx/server");

// src/server/controllers/screenshot.controller.ts
var import_starboy_framework2 = require("starboy-framework");

// ../../ProjectStarboy/src/server/interfaces/index.ts
var AppController = class {
  constructor(controllerName) {
    this.controllerName = "AppController";
    this.classType = "controller";
    this.controllerName = controllerName;
    this.logInfo(`Controller ${controllerName} initialized`);
  }
  log(...args) {
    console.log(`^6[${this.controllerName}]`, ...args);
  }
  logInfo(...args) {
    console.log(`[^5INFO^0]`, `[^6${this.controllerName}^0]`, ...args);
  }
  logSuccess(...args) {
    console.log(`[^2SUCCESS^0]`, `[^6${this.controllerName}^0]`, ...args);
  }
  logError(...args) {
    console.log(`[^1ERROR^0]`, `[^6${this.controllerName}^0]`, ...args);
  }
  logWarning(...args) {
    console.log(`[^3WARNING^0]`, `[^6${this.controllerName}^0]`, ...args);
  }
};
var AppService = class {
  constructor(serviceName) {
    this.serviceName = "AppService";
    this.classType = "service";
    this.serviceName = serviceName;
    this.logInfo(`Service ${serviceName} initialized`);
  }
  log(...args) {
    console.log(`^6[${this.serviceName}]`, ...args);
  }
  logInfo(...args) {
    console.log(`[^5INFO^0]`, `[^6${this.serviceName}^0]`, ...args);
  }
  logSuccess(...args) {
    console.log(`[^2SUCCESS^0]`, `[^6${this.serviceName}^0]`, ...args);
  }
  logError(...args) {
    console.log(`[^1ERROR^0]`, `[^6${this.serviceName}^0]`, ...args);
  }
  logWarning(...args) {
    console.log(`[^3WARNING^0]`, `[^6${this.serviceName}^0]`, ...args);
  }
};

// src/server/services/screenshot.service.ts
var import_starboy_framework = require("starboy-framework");
var import_jimp = __toESM(require("jimp"));

// src/server/utils/supabase.ts
var import_supabase_js = require("@supabase/supabase-js");
var supabase = (0, import_supabase_js.createClient)(
  GetConvar("supabase_url", ""),
  GetConvar("supabase_key", ""),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
var supabase_default = supabase;

// src/server/services/screenshot.service.ts
var import_fs = __toESM(require("fs"));
var ScreenshotService = class extends AppService {
  constructor() {
    super("ScreenshotService");
  }
  takeScreenshot(playerSrc, name, bucket) {
    return new Promise((resolve, reject) => {
      exports["screenshot-basic"].requestClientScreenshot(
        playerSrc,
        {
          fileName: `cache/${name}.png`,
          encoding: "png",
          quality: 1
        },
        async (err, data) => {
          this.logInfo(err);
          this.logInfo(data);
          const path = this.processImage(data, name, bucket);
          resolve(path);
        }
      );
    });
  }
  async processImage(path, name, bucket) {
    const imageBuffer = await import_fs.default.readFileSync(path);
    const image = await import_jimp.default.read(imageBuffer);
    const height = image.getHeight();
    const width = image.getWidth();
    let minW = width;
    let maxW = 0;
    let minH = height;
    let maxH = 0;
    console.log(`${width}x${height}`);
    for (let w = 0; w < width; w++) {
      for (let h = 0; h < height; h++) {
        const hexColor = image.getPixelColor(w, h);
        const rgbaColor = import_jimp.default.intToRGBA(hexColor);
        if (rgbaColor.r + rgbaColor.b < rgbaColor.g) {
          rgbaColor.a = 0;
        }
        const maskedInt = import_jimp.default.rgbaToInt(
          rgbaColor.r,
          rgbaColor.g,
          rgbaColor.b,
          rgbaColor.a
        );
        if (rgbaColor.a > 0) {
        } else {
          image.setPixelColor(maskedInt, w, h);
        }
      }
    }
    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
        const hexColor = image.getPixelColor(w, h);
        const rgbaColor = import_jimp.default.intToRGBA(hexColor);
        if (rgbaColor.a !== 0) {
          if (height - h > 40) {
            const hexColor2 = image.getPixelColor(w, h + 40);
            const rgbaColor2 = import_jimp.default.intToRGBA(hexColor2);
            if (rgbaColor2.a !== 0) {
              minH = h;
              break;
            }
          } else {
            minH = h;
            break;
          }
        }
      }
      if (minH !== height) {
        break;
      }
    }
    for (let w = width - 1; w >= 0; w--) {
      for (let h = 0; h < height; h++) {
        const hexColor = image.getPixelColor(w, h);
        const rgbaColor = import_jimp.default.intToRGBA(hexColor);
        if (rgbaColor.a !== 0) {
          if (w > 40) {
            const hexColor2 = image.getPixelColor(w - 40, h);
            const rgbaColor2 = import_jimp.default.intToRGBA(hexColor2);
            if (rgbaColor2.a !== 0) {
              maxW = w;
              break;
            }
          } else {
            maxW = w;
            break;
          }
        }
      }
      if (maxW !== 0) {
        break;
      }
    }
    for (let h = height - 1; h >= 0; h--) {
      for (let w = 0; w < width; w++) {
        const hexColor = image.getPixelColor(w, h);
        const rgbaColor = import_jimp.default.intToRGBA(hexColor);
        if (rgbaColor.a !== 0) {
          if (h > 40) {
            const hexColor2 = image.getPixelColor(w, h - 40);
            const rgbaColor2 = import_jimp.default.intToRGBA(hexColor2);
            if (rgbaColor2.a !== 0) {
              maxH = h;
              break;
            }
          } else {
            maxH = h;
            break;
          }
        }
      }
      if (maxH !== 0) {
        break;
      }
    }
    for (let w = 0; w < width; w++) {
      for (let h = 0; h < height; h++) {
        const hexColor = image.getPixelColor(w, h);
        const rgbaColor = import_jimp.default.intToRGBA(hexColor);
        if (rgbaColor.a !== 0) {
          if (width - w > 40) {
            const hexColor2 = image.getPixelColor(w + 40, h);
            const rgbaColor2 = import_jimp.default.intToRGBA(hexColor2);
            if (rgbaColor2.a !== 0) {
              minW = w;
              break;
            }
          } else {
            minW = w;
            break;
          }
        }
      }
      if (minW !== width) {
        break;
      }
    }
    console.log(minW, maxW, minH, maxH);
    minW = minW !== width ? minW : 0;
    maxW = maxW !== 0 ? maxW : width;
    minH = minH !== height ? minH : 0;
    maxH = maxH !== 0 ? maxH : height;
    image.crop(minW, minH, maxW - minW, maxH - minH);
    console.log(name);
    return new Promise((resolve, reject) => {
      image.getBuffer("image/png", async (err, buffer) => {
        const { data: hasBucket } = await supabase_default.storage.getBucket(bucket);
        if (!hasBucket) {
          const { data: createBucketData, error: error2 } = await supabase_default.storage.createBucket(bucket, {
            public: true,
            allowedMimeTypes: ["image/*"]
          });
          if (error2) {
            reject(error2.message);
            return;
          }
          console.log("CREATED BUCKET", createBucketData);
        }
        const { data, error } = await supabase_default.storage.from(bucket).upload(`${name}.png`, buffer, {
          cacheControl: "0",
          upsert: true,
          contentType: "image/png"
        });
        if (error) {
          reject(error.message);
          return;
        }
        if (data) {
          const publicPathResponse = await supabase_default.storage.from(bucket).getPublicUrl(`${name}.png`);
          this.logInfo(publicPathResponse.data.publicUrl);
          resolve(publicPathResponse.data.publicUrl);
          return;
        } else {
          reject("No data");
        }
      });
    });
  }
};
ScreenshotService = __decorateClass([
  (0, import_starboy_framework.Injectable)()
], ScreenshotService);

// src/server/controllers/screenshot.controller.ts
var ScreenshotController = class extends AppController {
  constructor(screenshotService) {
    super("ScreenshotController");
    this.screenshotService = screenshotService;
  }
  async takeScreenshot(source, [name, bucket]) {
    this.logInfo("Taking screenshot...");
    if (!name) {
      throw new Error("You must provide a name for the screenshot");
    }
    if (!bucket) {
      throw new Error("You must provide a bucket for the screenshot");
    }
    const response = await this.screenshotService.takeScreenshot(
      source,
      name,
      bucket
    );
    return response;
  }
  async switchBucket(source, isBack) {
    if (isBack) {
      SetPlayerRoutingBucket(source, 0);
      return;
    }
    SetPlayerRoutingBucket(source, Number(source));
  }
};
__decorateClass([
  (0, import_starboy_framework2.NetCallback)("screenshot:takeScreenshot"),
  (0, import_starboy_framework2.ChatCommand)("screenshot")
], ScreenshotController.prototype, "takeScreenshot", 1);
__decorateClass([
  (0, import_starboy_framework2.NetEvent)("screenshot:switchBucket")
], ScreenshotController.prototype, "switchBucket", 1);
ScreenshotController = __decorateClass([
  (0, import_starboy_framework2.Controller)(),
  __decorateParam(0, (0, import_starboy_framework2.Inject)(ScreenshotService))
], ScreenshotController);

// src/server/server.ts
var import_starboy_framework3 = require("starboy-framework");
var server = import_starboy_framework3.App.create({
  controllers: [ScreenshotController]
});
server.start();
