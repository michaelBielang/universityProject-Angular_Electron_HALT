/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';
// import ldap from './business-logic/ldap.controler';
// import vpn from './business-logic/vpn.controler';


export function auth_login(req, res, next) {
  logger.info(`auth_login controler test`);

  logger.info(req.body['id']);

  res.status(200).json({
    message: 'Auth successful',
    userObj: {},
  });
}
