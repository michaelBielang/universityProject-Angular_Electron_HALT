/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';


export function faculty_index(req, res, next) {
  logger.info(`faculty_index controler test`);

  res.status(200).json({
    message: 'faculty_index successful',
    userObj: {},
  });
}
