/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import * as winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new (winston.transports.Console)({ format: winston.format.simple(), level: 'info' }),
    new (winston.transports.File)({ filename: 'src/api/logging/user-controler.log', level: 'error' }),
  ],
});

export function user_index(req, res, next) {
  res.status(200).json({
    message: 'Retrieved users',
  });

  logger.info(`Logger example`);
}

export function user_show(req, res, next) {
  res.status(200).json({
    message: 'Retrieved user ' + req.params.userid + ' (API Test)',
  });
}

export function user_create(req, res, next) {
  res.status(200).json({
    message: 'Created user',
  });
}

export function user_update(req, res, next) {
  res.status(200).json({
    message: 'Updated user ' + req.params.userid,
  });
}

export function user_delete(req, res, next) {
  res.status(200).json({
    message: 'Deleted user ' + req.params.userid,
  });
}
