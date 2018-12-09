/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../../logging/logger';

class ErrorResHandler {
  errResponse(res, message?: string, status?: number) {
    if (message) {
      logger.error(message);
    }
    res.status(status || 409).json({
      message: message || 'request failed'
    });
  }
}

export default new ErrorResHandler();
