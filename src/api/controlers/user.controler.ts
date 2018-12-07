/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';
import * as db from '../datastorage';

export function user_show(req, res, next) {
  if (req.params['userid']) {
    logger.info(`User_show controller test`);
    db.dbInterface.dbFunctions.getUser()
      res.status(200).json({
      message: 'Retrieved user ' + req.params.userid + ' (API Test)',
    });
  } else {
    res.status(409).json({
      message: 'User not present',
    });
  }


}
