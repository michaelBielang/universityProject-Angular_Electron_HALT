/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import api from './api';
import env from './server-env';
import logger from './logging/logger';


const apiObject = api.listen(env.port, err => {
  if (err) {
    return logger.error(err);
  }
  return logger.info(`server is listening on ${env.port} in \'prod\' mode`);
});

/**
 * exporting explicitely for testing, in order to be able to actually use and
 * close the express server after tests
 */
export default {
  api: api,
  apiObj: apiObject
};
