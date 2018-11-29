/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';


export function user_show(req, res, next) {
  logger.info(`User_show controler test`);

  res.status(200).json({
    message: 'Retrieved user ' + req.params.userid + ' (API Test)',
  });
}
