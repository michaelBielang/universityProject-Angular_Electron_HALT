/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import * as path from 'path';
import api from './api';
import env from './server-env';
import * as winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new (winston.transports.Console)({ format: winston.format.simple(), level: 'info' }),
    new (winston.transports.File)({ filename: path.join(__dirname, 'logging/api-server.log'), level: 'error' }),
  ],
});

api.listen(env.port, err => {
  if (err) {
    return logger.error(err);
  }
  return logger.info(`server is listening on ${env.port} in \'${env.mode}\' mode`);
});

// event that catches e. g. CTRL+C events, gives possibility to perform actions before killing app
import nodemon from 'nodemon';
// Handle CTRL+C
process.on('SIGINT', function() {
  // so the program will not close instantly
  process.stdin.resume();
  logger.info('\nGracefully shutting down api...');
  if (nodemon) {
    nodemon.emit('quit');
  }
  process.exit();
});
