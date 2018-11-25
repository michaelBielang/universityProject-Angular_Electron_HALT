/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import * as path from 'path';
import api from './api';
import env from './server-env';
import * as winston from 'winston';


console.info('Server testing');


const logger = winston.createLogger({
  transports: [
    new (winston.transports.Console)({ level: 'info' }),
    new (winston.transports.File)({ filename: path.join(__dirname, 'logging/api-server.log'), level: 'error' }),
  ],
});

api.listen(env.port, (err) => {
  if (err) {
    return logger.error(err);
  }

  return logger.info(`server is listening on ${env.port} in \'${env.mode}\' mode`);
});

// event that catches e. g. CTRL+C events, gives possibility to perform actions before killing app
// import nodemon from 'nodemon';
// process
//   // Handle CTRL+C
//   .on('SIGINT', function() {
//     // so the program will not close instantly
//     process.stdin.resume();
//     logger.info('\nGracefully shutting down api...');
//     if (nodemon) {
//       nodemon.emit('quit');
//     }
//     process.exit();
//   });
