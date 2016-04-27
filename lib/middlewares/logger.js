/**
 * 把日志输出到日志系统
 * 在app.js中的加载越早越好，计算响应时间。因为日志是在finish的时候打的
 */

import { accessLogger as logger } from '../config/winston';

export default function (req, res, next) {
  const start = new Date();
  const writeHead = res.writeHead;

  res._json = res.json;
  res.json = (obj) => {
    res.responseData = obj;
    res._json(obj);
  };

  res.writeHead = (code, headers) => {
    res.writeHead = writeHead;
    res.writeHead(code, headers);
    res.__statusCode = code;
    res.__headers = headers || {};
  };

  const ip = req.headers['x-real-ip'] ||
    req.ips.slice().pop() ||
    req.ip ||
    req.connection.remoteAddress;

  res.on('finish', () => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    res.responseTime = new Date() - start;
    const logData = {
      category: 'access',
      method: req.method,
      status: res.__statusCode || res.statusCode,
      remoteAddress: ip,
      reqPath: req.path,
      // reqBody: req.body,
      reqQuery: req.query,
      reqHeaders: req.headers,
      reqFormdata: req.formdata,
      responseTime: res.responseTime,
      user: req.user && req.user._id,
      rspData: res.responseData,
    };
    const loggerFunc = res.statusCode >= 400 ? logger.warn : logger.info;
    loggerFunc(logData);
  });
  next();
}
