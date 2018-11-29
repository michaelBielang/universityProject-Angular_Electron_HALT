/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';

export function servergroup_index(req, res, next) {
  logger.info(`servergroup_index controler test`);

  res.status(200).json({
    message: 'servergroup_index successful',
  });
}

export function servergroup_show(req, res, next) {
  logger.info(`servergroup_show controler test`);

  res.status(200).json({
    message: 'servergroup_show successful',
  });
}
