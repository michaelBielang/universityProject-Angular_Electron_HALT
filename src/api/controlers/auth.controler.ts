/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import * as db from '../datastorage/dbInterface';
import logger from '../logging/logger';
import errHandler from './services/error.handler';
// @ts-ignore
import ldap from './business-logic/ldap.controler';
// @ts-ignore
import vpn from './business-logic/vpn.controler';


export async function auth_login(req, res, next) {
  const userid = req.body['id'].toLowerCase();
  const pw = req.body['pw'];
  let email;
  let rzKennung;

  if (ldap.isEmailAddress(userid)) {
    email = userid;
  } else {
    rzKennung = userid;
  }

  let userObj;
  await db.dbFunctions.getUser(email, rzKennung).then(user => {
    if (user) {
      userObj = user;
      rzKennung = user['pk_user_id'].toLowerCase();
    }
  }).catch(err => {
    logger.error(err);
    errHandler.errResponse(res, err.message);
  });

  if (rzKennung) {
    vpn.connectHsaVpn({ id: rzKennung, pw: pw }).then(() => {
      ldap.getLdapClient().then(client => {
        ldap.auth(client, rzKennung, pw).then(async () => {
          let newUserObj;
          if (userObj) {
            await db.dbFunctions.updateUser(email, rzKennung).catch(err => {
              errHandler.errResponse(res, err.message);
            });
          } else {
            await ldap.getLdapUserInfo(client, rzKennung).then(ldapUser => {
              if (ldapUser['data']) {
                newUserObj = ldapUser['data'][0];
              }
            }).catch(err => {
              logger.error(err);
              errHandler.errResponse(res, err.message);
            });
          }

          if (!userObj && newUserObj) {
            await db.dbFunctions.addUser(
              newUserObj['uid'],
              newUserObj['givenName'],
              newUserObj['sn'],
              newUserObj['mail']).catch(err => {
                throw err;
              });
          }

          await db.dbFunctions.getUser(email, rzKennung).then(dbUser => {
            userObj = dbUser;
          }).catch(err => {
            throw new Error(err['message']);
          });

          res.status(200).json({
            message: 'Auth successful',
            userObj: userObj,
          });
        }).catch(err => {
          logger.error(err);
          errHandler.errResponse(res, err['message']);
        });
      }).catch(err => {
        logger.error(err);
        errHandler.errResponse(res, err['message']);
      });
    }).catch(err => {
      logger.error(err);
      errHandler.errResponse(res, err['message']);
    });
  } else {
    errHandler.errResponse(res, 'Invalid login data');
  }
}
