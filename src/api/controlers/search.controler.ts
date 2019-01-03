/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';
import ldap from './business-logic/ldap.controler';
import fuzzy from './business-logic/fuzzy.controler';
import * as db from '../datastorage';
import errHandler from './services/error.handler';
import ISearchObj from './models/search-obj.model';


/**
 * using controlers from business-logic to look for given search input in HS LDAP
 * Route: /api/search/:userid
 * @param req
 * @param res
 * @param next
 */
export function search_exec(req, res, next) {
  const searchObj: ISearchObj = {
    gender: req.body['gender'],
    id: req.body['id'],
    name: req.body['name'],
    email: req.body['email'] ? req.body['email'].toLowerCase() : undefined,
    faculty: req.body['faculty'],
    subjectordegree: req.body['subjectordegree'],
  };
  db.dbInterface.dbFunctions.addHistory(req.params['userid'], searchObj['id'],
    searchObj['name'], searchObj['email'], searchObj['faculty'],
    searchObj['subjectordegree'], searchObj['gender'])
    .then(() => {
      ldap.ldapSearch(searchObj).then(data => {
        fuzzy.fuzzySearch(data, searchObj).then(fuzzyData => {
          res.status(200).json({
            message: 'Search successful',
            data: fuzzyData,
          });
        }).catch(err => {
          throw err;
        });
      }).catch(err => {
        throw err;
      });
    }).catch(err => {
    logger.error(err);
    errHandler.errResponse(res, err.message);
  });
}
