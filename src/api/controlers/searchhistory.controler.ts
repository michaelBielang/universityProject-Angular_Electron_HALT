/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';

export function searchhistory_index(req, res, next) {
  logger.info(`searchhistory_index controler test`);

  res.status(200).json({
    message: 'searchhistory_index successful',
  });
}

export function searchhistory_show(req, res, next) {
  logger.info(`searchhistory_show controler test`);

  res.status(200).json({
    message: 'searchhistory_show successful',
  });
}

export function searchhistory_create(req, res, next) {
  logger.info(`searchhistory_index controler test`);

  res.status(200).json({
    message: 'searchhistory_create successful',
  });
}
