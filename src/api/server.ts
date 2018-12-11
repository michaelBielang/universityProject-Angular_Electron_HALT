/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import api from './api';
import env from './server-env';
import logger from './logging/logger';


api.listen(env.port, err => {
  if (err) {
    return logger.error(err);
  }


  // TODO
  logger.error('Test Error!');


  return logger.info(`server is listening on ${env.port} in \'prod\' mode`);
});
