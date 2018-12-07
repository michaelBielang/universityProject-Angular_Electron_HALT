/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';
// @ts-ignore
import ldap from './business-logic/ldap.controler';
// @ts-ignore
import vpn from './business-logic/vpn.controler';

//todo chris
export function auth_login(req, res, next) {
  let userid = req.body['id'];
  let pw = req.body['pw'];

  // DEBUG
  logger.info('request for ' + req.body['id'] + '; Request was in HSA subnet: ' + vpn.isInHsaSubnet());

  // 1. test if id looks like an email address
  if (ldap.isEmailAddress(userid)) {
    // TODO: perform db call
  }
  // 2. if email look into db to get corresponding rz-id

  vpn.connectHsaVpn({id: userid, pw: pw}).then(result => {

    // TODO: implement auth logic
    logger.info(result);


    res.status(200).json({
      message: 'Auth successful',
      userObj: {
        userid: req.body['id']
      },
    });
  }).catch(err => {
    logger.info(err);
    res.status(409).json({
      message: err.message
    });
  });
}
