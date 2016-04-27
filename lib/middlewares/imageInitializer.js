import omit from 'lodash/omit';
import { parseJSON, isReq } from '../helpers/utils';
import DDError from '../helpers/dderror';

// 向req添加imageBuffer和imageOptions；
// options的参数就是sharp的参数
export default function (req, res, next) {
  const { options } = req.query;
  if (options) {
    const data = parseJSON(options);
    if (data[0]) {
      return next(new DDError('json_parse_error'));
    }
    /* eslint-disable no-param-reassign */
    req.imageOptions = data[1] || [];
  }

  if (isReq(req, 'multipart/form-data')) {
    req.imageBuffer = req.file.buffer;
    req.formdata = omit(req.file, 'buffer');
    return next();
  } else if (isReq(req, 'application/octet-stream')) {
    req.imageBuffer = req.body;
    return next();
  }
  /* eslint-enable */
  return next(new DDError('params_error'));
}
