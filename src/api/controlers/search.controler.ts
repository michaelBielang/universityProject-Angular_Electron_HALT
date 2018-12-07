/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';
// import ldap from './business-logic/ldap.controler';
// import vpn from './business-logic/vpn.controler';

// aAkunftspunkt todo michi
export function search_exec(req, res, next) {
  logger.info(`search_exec controler test`);

  res.status(200).json({
    message: 'Search successful',
    userObj: {},
  });
}
