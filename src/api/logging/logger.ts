/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import * as path from 'path';
import * as fs from 'fs';
import { createLogger, transports, format } from "winston";

/**
 * a simple prepared logger to centralize logging into a file in error case for production mode
 */
export class Logger {
  private loggingPath = path.join(__dirname, 'logging');
  private logger: any;

  constructor() {
    if (!fs.existsSync(this.loggingPath)) {
      fs.mkdirSync(this.loggingPath);
    }

    const options = {
      level: "info",
      format: format.simple(),
    };

    options["transports"] = [
      new transports.Console({ level: "info" }),
    ];

    options["transports"].push(new transports.File({
      filename: path.join(this.loggingPath, 'express.log'),
      level: "error"
    }));

    this.logger = createLogger(options);
  }

  getLogger() {
    return this.logger;
  }
}

export default new Logger().getLogger();
