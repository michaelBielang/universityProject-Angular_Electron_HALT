/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';
import * as db from '../datastorage';
import errHandler from './services/error.handler';

// alle todo michi
export function searchhistory_index(req, res, next) {
  logger.info(`searchhistory_index controler test`);
  db.dbInterface.dbFunctions.getHistory(req.params['userId'])
    .then(resolve => {
      res.status(200).json({
        message: 'searchhistory_index successful',
        historyObjs: resolve
      });
    })
    .catch(err => {
      errHandler.errResponse(res, err.message);
    });
}
