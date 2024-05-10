import { __awaiter, __decorate, __metadata } from "tslib";
import { AppService } from '@core-sv/interfaces';
import { Injectable } from 'starboy-framework';
import Jimp from 'jimp';
import supabase from 'utils/supabase';
import fs from 'fs';
let ScreenshotService = class ScreenshotService extends AppService {
    constructor() {
        super('ScreenshotService');
    }
    takeScreenshot(playerSrc, name, bucket) {
        return new Promise((resolve, reject) => {
            exports['screenshot-basic'].requestClientScreenshot(playerSrc, {
                fileName: `cache/${name}.png`,
                encoding: 'png',
                quality: 1.0,
            }, (err, data) => __awaiter(this, void 0, void 0, function* () {
                this.logInfo(err);
                this.logInfo(data);
                const path = this.processImage(data, name, bucket);
                resolve(path);
            }));
        });
    }
    processImage(path, name, bucket) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageBuffer = yield fs.readFileSync(path);
            const image = yield Jimp.read(imageBuffer);
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
                    const rgbaColor = Jimp.intToRGBA(hexColor);
                    if (rgbaColor.r + rgbaColor.b < rgbaColor.g) {
                        rgbaColor.a = 0;
                    }
                    /* console.log(rgbaColor); */
                    const maskedInt = Jimp.rgbaToInt(rgbaColor.r, rgbaColor.g, rgbaColor.b, rgbaColor.a);
                    if (rgbaColor.a > 0) {
                    }
                    else {
                        image.setPixelColor(maskedInt, w, h);
                    }
                }
            }
            //top
            for (let h = 0; h < height; h++) {
                for (let w = 0; w < width; w++) {
                    const hexColor = image.getPixelColor(w, h);
                    const rgbaColor = Jimp.intToRGBA(hexColor);
                    if (rgbaColor.a !== 0) {
                        //console.log(h);
                        if (height - h > 40) {
                            const hexColor2 = image.getPixelColor(w, h + 40);
                            const rgbaColor2 = Jimp.intToRGBA(hexColor2);
                            if (rgbaColor2.a !== 0) {
                                minH = h;
                                //console.log("break", h);
                                break;
                            }
                        }
                        else {
                            minH = h;
                            break;
                        }
                    }
                }
                if (minH !== height) {
                    break;
                }
            }
            //right
            for (let w = width - 1; w >= 0; w--) {
                for (let h = 0; h < height; h++) {
                    const hexColor = image.getPixelColor(w, h);
                    const rgbaColor = Jimp.intToRGBA(hexColor);
                    if (rgbaColor.a !== 0) {
                        if (w > 40) {
                            const hexColor2 = image.getPixelColor(w - 40, h);
                            const rgbaColor2 = Jimp.intToRGBA(hexColor2);
                            if (rgbaColor2.a !== 0) {
                                maxW = w;
                                break;
                            }
                        }
                        else {
                            maxW = w;
                            break;
                        }
                    }
                }
                if (maxW !== 0) {
                    break;
                }
            }
            //bottom
            for (let h = height - 1; h >= 0; h--) {
                for (let w = 0; w < width; w++) {
                    const hexColor = image.getPixelColor(w, h);
                    const rgbaColor = Jimp.intToRGBA(hexColor);
                    if (rgbaColor.a !== 0) {
                        if (h > 40) {
                            const hexColor2 = image.getPixelColor(w, h - 40);
                            const rgbaColor2 = Jimp.intToRGBA(hexColor2);
                            if (rgbaColor2.a !== 0) {
                                maxH = h;
                                break;
                            }
                        }
                        else {
                            maxH = h;
                            break;
                        }
                    }
                }
                if (maxH !== 0) {
                    break;
                }
            }
            //left
            for (let w = 0; w < width; w++) {
                for (let h = 0; h < height; h++) {
                    const hexColor = image.getPixelColor(w, h);
                    const rgbaColor = Jimp.intToRGBA(hexColor);
                    if (rgbaColor.a !== 0) {
                        if (width - w > 40) {
                            const hexColor2 = image.getPixelColor(w + 40, h);
                            const rgbaColor2 = Jimp.intToRGBA(hexColor2);
                            if (rgbaColor2.a !== 0) {
                                minW = w;
                                break;
                            }
                        }
                        else {
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
                image.getBuffer('image/png', (err, buffer) => __awaiter(this, void 0, void 0, function* () {
                    const { data: hasBucket } = yield supabase.storage.getBucket(bucket);
                    if (!hasBucket) {
                        const { data: createBucketData, error } = yield supabase.storage.createBucket(bucket, {
                            public: true,
                            allowedMimeTypes: ['image/*'],
                        });
                        if (error) {
                            reject(error.message);
                            return;
                        }
                        console.log('CREATED BUCKET', createBucketData);
                    }
                    const { data, error } = yield supabase.storage
                        .from(bucket)
                        .upload(`${name}.png`, buffer, {
                        cacheControl: '0',
                        upsert: true,
                        contentType: 'image/png',
                    });
                    if (error) {
                        reject(error.message);
                        return;
                    }
                    if (data) {
                        const publicPathResponse = yield supabase.storage
                            .from(bucket)
                            .getPublicUrl(`${name}.png`);
                        this.logInfo(publicPathResponse.data.publicUrl);
                        resolve(publicPathResponse.data.publicUrl);
                        return;
                    }
                    else {
                        reject('No data');
                    }
                }));
            });
        });
    }
};
ScreenshotService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], ScreenshotService);
export { ScreenshotService };
//# sourceMappingURL=screenshot.service.js.map