import config from '../config.js';

import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
// let mongoose = require('mongoose');

import { normalLogger as logger } from './config/winston';

import routes from './routes';

const app = express();

// mongoose.connect(config.mongo);
// mongoose.connection.on('error', function () {
//   logger.error('MongoDB Connection Error. Make sure MongoDB is running.');
// });


import loggerMiddleware from './middlewares/logger';
import corsMiddleware from './middlewares/cors';

app.use(loggerMiddleware);
app.use(helmet());
app.use(corsMiddleware);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.text());
app.use(bodyParser.raw({
  limit: '20mb',
}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use((err, req, res, next) => {
  const errobj = {
    message: err.message,
    errtext: err.errtext,
  };
  if (config.env !== 'production') {
    errobj.err = err;
    errobj.more = err.more;
  }
  res.status(err.status || 500)
    .json(errobj);
});

app.enable('trust proxy');

const port = process.env.PORT || config.port;

// 数据库连接成功后开启API
// mongoose.connection.on('open', function () {
//   logger.info(`MongoDB Connected: ${config.mongo}`);
app.listen(port, () => {
  logger.info(`Express server listening on port ${port}`);
});
// });
