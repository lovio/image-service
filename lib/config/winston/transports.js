import moment from 'moment';
import config from '../../../config';
const loggerConf = config.logger || {};

/**
 * transports defined here
 * console, file, udp and mail
 */
// https://github.com/winstonjs/winston/blob/master/docs/transports.md
const consoleTransport = {
  timestamp: true,
  colorize: true,
  // for oneline
  // json: true,
  // stringify: true,
  // or for debug with better visual
  prettyPrint: true,
  // 捕捉程序异常
  handleExceptions: true,
  humanReadableUnhandledException: true,
};

const time = moment().format('YYYY-MM-DD HH:mm:ss');
const mailSubject = `${config.appName} Server log [${config.env}] + ${time}`;

const mailTransport = Object.assign({}, {
  subject: mailSubject,
}, loggerConf.mailer);

export function getTransports() {
  const transports = {
    console: consoleTransport,
  };
  if (loggerConf.mailer) {
    transports.Mail = mailTransport;
  }
  if (loggerConf.udp) {
    transports.logstashUDP = loggerConf.udp;
  }
  return transports;
}
