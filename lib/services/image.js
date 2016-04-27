import sharp from 'sharp';
import difference from 'lodash/difference';
import keys from 'lodash/keys';
import each from 'async/each';
import setImmediate from 'async/setImmediate';
import DDError from '../helpers/dderror.js';
import { md5 } from '../helpers/utils.js';

const BASICOPTIONS = ['width', 'height', 'quality', 'prefix'];

// 根据参数处理图片，返回图片buffer数组
export function opImage(imageBuffer, name, imageOptions, cb) {
  const image = sharp(imageBuffer);
  return image.metadata((err, metadata) => {
    if (err) {
      return cb(new DDError('invalid_image'));
    }
    const imageName = name || `${md5(imageBuffer)}.${metadata.format}`;
    const outputImages = [{
      buffer: imageBuffer,
      filename: imageName,
    }];
    // 处理options
    return each(imageOptions, (option, ecb) => {
      if (difference(BASICOPTIONS, keys(option)).length) {
        return setImmediate(ecb);
      }
      const { width, height, quality } = option;
      let bufferClone = image.clone().resize(width, height).quality(quality);
      if (option.crop && sharp.gravity[option.crop]) {
        bufferClone = bufferClone.crop(sharp.gravity[option.crop]);
      }
      return bufferClone.toBuffer((er, outputBuffer) => {
        if (er) {
          return ecb();
        }
        outputImages.push({
          buffer: outputBuffer,
          filename: option.prefix + imageName,
        });
        return ecb();
      });
    }, (e) => cb(e, outputImages));
  });
}
