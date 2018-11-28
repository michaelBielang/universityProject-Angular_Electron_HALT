/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';


export function user_index(req, res, next) {
  res.status(200).json({
    message: 'Retrieved users',
  });
}

export function user_show(req, res, next) {
  logger.info(`User_show controler test`);

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
