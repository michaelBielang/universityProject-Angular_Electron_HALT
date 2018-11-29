/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import api from './api';
import env from './server-env';
import logger from './logging/logger';


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
