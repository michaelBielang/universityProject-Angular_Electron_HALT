/**
 * @author Christoph Bichlmeier, Michael Bielang
 * @license UNLICENSED
 */

import * as db from '../datastorage';
import errHandler from './services/error.handler';

export function searchhistory_index(req, res, next) {
  db.dbInterface.dbFunctions.getHistory(req.params['userid'])
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
