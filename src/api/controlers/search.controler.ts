/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';
// import ldap from './business-logic/ldap.controler';
// import vpn from './business-logic/vpn.controler';
import * as db from '../datastorage';

// Ankunftspunkt todo michi
export function search_exec(req, res, next) {
  logger.info(`search_exec controller test`);
  // todo für Test neuen Param userName beachten
  // todo VPN Ergebnis zurückliefern
  db.dbInterface.dbFunctions.addHistory(req.params['userId'], req.params['idInput'],
    req.params['userName'], req.params['emailInput'], req.params['facultyInput'],
    req.params['studySubjectInput'], req.params['gender'])
    .then(resolve => {
      res.status(200).json({
        message: 'Search successful',
        userObj: {},
      });
    }).catch(err => {
    res.status(200).json({
      message: 'Search successful',
      userObj: {},
    });
  });

}
