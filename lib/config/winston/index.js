/**
 * 日志规则
 * 除了accessLog，其他全部使用normalLogger
 * level error会发送邮件，其余级别的比如warn酌情使用
 * 所有日志都会udp发送到日志系统
 */

import winston from 'winston';
import 'winston-mail';
import 'winston-logstash-udp';

import transports from './transports';

winston.loggers.add('access', transports);
winston.loggers.add('normal', transports);

const accessLogger = winston.loggers.get('access');
const normalLogger = winston.loggers.get('normal');
accessLogger.exitOnError = false;
normalLogger.exitOnError = false;

export {
  accessLogger,
  normalLogger,
};
