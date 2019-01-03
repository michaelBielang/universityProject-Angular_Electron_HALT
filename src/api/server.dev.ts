/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import api from './api';
import env from './server-env';
import logger from './logging/logger';
// event that catches e. g. CTRL+C events, gives possibility to perform actions before killing app
import nodemon from 'nodemon';

const apiObject = api.listen(env.port, err => {
  if (err) {
    return logger.error(err);
  }
  return logger.info(`server is listening on ${env.port} in \'prod\' mode`);
});

export default {
  api: api,
  apiObj: apiObject
};

// Handle CTRL+C only for dev mode
process.on('SIGINT', function () {
  // so the program will not close instantly
  process.stdin.resume();
  logger.info('\nGracefully shutting down api...');
  if (nodemon) {
    nodemon.emit('quit');
  }
  process.exit();
});
