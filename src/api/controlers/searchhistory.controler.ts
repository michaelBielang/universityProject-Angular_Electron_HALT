/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';
import * as db from '../datastorage';
import errHandler from './services/error.handler';

/**
 * api/searchhistories
 * @param req
 * @param res
 * @param next
 */
export function searchHistory_index(req, res, next) {
  db.dbInterface.dbFunctions.getAllHistoryEntries(req.params['userid'])
    .then(resolve => {
      res.status(200).json({
        message: 'searchHistory_index successful',
        historyObjs: resolve
      });
    })
    .catch(err => {
      errHandler.errResponse(res, err.message);
    });
}
