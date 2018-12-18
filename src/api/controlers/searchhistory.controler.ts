/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../logging/logger';
import * as db from '../datastorage';

// alle todo michi
export function searchhistory_index(req, res, next) {
  logger.info(`searchhistory_index controler test`);
  db.dbInterface.dbFunctions.getAllHistoryEntries(req.params['searchhistoryid'])
    .then(resolve => {
      res.status(200).json({
        message: 'searchhistory_index successful',
        historyObj: resolve
      });
    })
    .catch(err => {
      logger.info(err);
      // todo @chris -> wird der 404 angezeigt oder ist der intern?
      // denn extern macht ein 404 anzuzeigen kein Sinn, es ist ja nur bisher einfach kein
      // Eintrag vorhanden
      res.status(404).json({
        message: 'no history available',
      });
    })
  ;
}
