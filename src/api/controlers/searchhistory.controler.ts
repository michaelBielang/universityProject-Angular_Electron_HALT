/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';

//alle todo michi
export function searchhistory_index(req, res, next) {
  logger.info(`searchhistory_index controler test`);

  res.status(200).json({
    message: 'searchhistory_index successful',
  });
}


//bestimmte todo
export function searchhistory_show(req, res, next) {
  logger.info(`searchhistory_show controler test`);

  res.status(200).json({
    message: 'searchhistory_show successful',
  });
}

//todo
export function searchhistory_create(req, res, next) {
  logger.info(`searchhistory_index controler test`);

  res.status(200).json({
    message: 'searchhistory_create successful',
  });
}
