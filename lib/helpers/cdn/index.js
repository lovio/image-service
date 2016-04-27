import map from 'lodash/map';
import noop from 'lodash/noop';
import * as upyun from './upyun.js';

export function upload(files, cb) {
  return upyun.upload(files, (err, rst) => {
    if (err) {
      return cb(err);
    }
    // flush cache
    upyun.flushCache(map(files, 'filename'), noop);
    return cb(null, rst);
  });
}


export function exifInfo(filename, cb) {
  return upyun.exifInfo(filename, cb);
}
