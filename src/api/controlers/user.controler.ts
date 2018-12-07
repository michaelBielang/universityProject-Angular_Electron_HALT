/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';
import * as db from '../datastorage';
// @ts-ignore
import ldap from './business-logic/ldap.controler';

export function user_show(req, res, next) {
  if (req.params['userid']) {
    logger.info(`User_show controller test`);
    let email;
    let rzKennung;
    if (ldap.isEmailAddress(req.params['userid'])) {
      email = req.params['userid'];
    } else {
      rzKennung = req.params['userid'];
    }
    db.dbInterface.dbFunctions.getUser(email, rzKennung).then(user => {
      if (user) {
        res.status(200).json({
          message: 'Retrieved user ' + req.params.userid + ' (API Test)',
          // todo test user
          userObj: user
        });
      } else {
        res.status(404).json({
          message: 'User not found'
        });
      }
    }).catch(err => {
      logger.info(err);
      res.status(409).json({
        message: 'User not present',
      });
    });
  } else {
    res.status(409).json({
      message: 'User not present',
    });
  }
}
