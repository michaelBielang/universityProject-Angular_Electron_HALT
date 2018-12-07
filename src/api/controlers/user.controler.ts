/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

// import logger from '../logging/logger';
import errHandler from './services/error.handler';
import * as db from '../datastorage';
// @ts-ignore
import ldap from './business-logic/ldap.controler';

export function user_show(req, res, next) {
  if (req.params['userid']) {
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
        errHandler.errResponse(res, 'User not found', 404);
      }
    }).catch(err => {
      errHandler.errResponse(res, err.message, 404);
    });
  } else {
    errHandler.errResponse(res, 'User not present', 404);
  }
}
