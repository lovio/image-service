import map from 'lodash/map';
// uploader
import * as cdnHelper from '../helpers/cdn';
import { opImage } from '../services/image';

// let logger = require('../config/winston/').normalLogger;

export function upload(req, res, next) {
  opImage(req.imageBuffer, req.query.name, req.imageOptions, (err, images) => {
    if (err) {
      return next(err);
    }
    return cdnHelper.upload(images, (er) => {
      if (err) {
        return next(er);
      }
      return res.send(map(images, 'filename'));
    });
  });
}

export function exifInfo(req, res, next) {
  const name = req.query.name;
  return cdnHelper.exifInfo(name, (err, rst) => {
    if (err) {
      return next(err);
    }
    return res.json(rst || {});
  });
}
