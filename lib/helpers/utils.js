import crypto from 'crypto';
import isString from 'lodash/isString';

export function md5(data) {
  const md5sum = crypto.createHash('md5');
  if (isString(data)) {
    md5sum.update(data, 'utf8');
  } else {
    md5sum.update(data);
  }
  return md5sum.digest('hex');
}

export function isReq(req, contentType) {
  return req.is(contentType) === contentType;
}

export function parseJSON(stringifiedJSON) {
  let err;
  let data;
  try {
    data = JSON.parse(stringifiedJSON);
  } catch (e) {
    err = e;
  }
  return [err, data];
}
