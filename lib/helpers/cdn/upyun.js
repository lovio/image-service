// https://github.com/upyun/node-upyun/wiki/%E4%B8%AD%E6%96%87%E8%AF%B4%E6%98%8E
import map from 'lodash/map';
import eachLimit from 'async/eachLimit';
import request from 'request';
import config from '../../../config';
const upyunConf = config.upyun;
const imageUrlBase = config.imageUrlBase;
import UPYUN from 'upyun';
import { normalLogger as logger } from '../../config/winston';
import { md5, parseJSON } from '../utils';

const { buckname, username, password, endpoint } = upyunConf;

const upyun = new UPYUN(buckname, username, password, endpoint);

// exports.upload = function (buffer, filename, cb) {
// files是数组，{buffer: xxxx, filename: xxx}
export function upload(files, cb) {
  eachLimit(files, 10, (file, ecb) => {
    const filename = file.filename;
    return upyun.uploadFile(`/${filename}`, file.buffer, 'text/plain', true,
      (err, result) => {
        if (err) {
          return ecb(err);
        }
        const statusCode = result.statusCode;
        if (+statusCode !== 200) {
          logger.warn('unable to upload to upyun', filename, result);
          return ecb('fail');
        }
        logger.info('upload to upyun', filename);
        return ecb(err, result);
      });
  }, cb);
}

export function removeFile(filename, cb) {
  upyun.removeFile(`/${filename}`, cb);
}

export function listDir(cb) {
  upyun.listDir('/', cb);
}

// 可以查看文件的信息，在data里
export function existsFile(filename, cb) {
  upyun.existsFile(`/${filename}`, cb);
}

export function exifInfo(filename, cb) {
  request.get(`${imageUrlBase}/${filename}!exif`, (err, response, body) => {
    const data = parseJSON(body);
    return cb(err, data[1]);
  });
}

export function flushCache(filenames, cb) {
  const imagesUrl = map(filenames, (fn) => `${imageUrlBase}/${fn}`).join('\n');
  const date = new Date().toGMTString();
  let sign = [imagesUrl, buckname, date, md5(password)].join('&');
  sign = md5(sign);
  const authStr = `UpYun ${[buckname, username, sign].join(':')}`;
  const options = {
    url: upyunConf.purgeUrl,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      Authorization: authStr,
      Date: date,
    },
    form: `purge=${imagesUrl}`,
    method: 'POST',
  };
  return request(options, (err, response, body) => {
    if (err) {
      logger.error('upyun flushcache error', options, body);
      return cb(err);
    }
    logger.info('upyun flushcache', imagesUrl, body);
    return cb(null, body);
  });
}
