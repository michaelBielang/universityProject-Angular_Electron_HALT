/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';
import * as db from '../datastorage';

// alle todo michi
export function searchhistory_index(req, res, next) {
  logger.info(`searchhistory_index controler test`);
  db.dbInterface.dbFunctions.getHistory(req.params['userId'])
    .then(resolve => {
      res.status(200).json({
        message: 'searchhistory_index successful',
        historyObj: resolve
      });
    })
    .catch(err => {
      logger.info(err);
    })
  ;
}

// bestimmte todo
export function searchhistory_show(req, res, next) {
  logger.info(`searchhistory_show controler test`);

  res.status(200).json({
    message: 'searchhistory_show successful',
  });
}

export function searchhistory_create(req, res, next) {
  // todo
}
