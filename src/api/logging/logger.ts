/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import * as path from 'path';
import * as fs from 'fs';
// import * as elog from 'electron-log';
import { createLogger, transports, format } from "winston";

export class Logger {
  private loggingPath = path.join(__dirname, 'logging');
  private logger: any;

  // constructor() {
  //   this.logger = elog;
  //   if (!fs.existsSync(this.loggingPath)) {
  //     fs.mkdirSync(this.loggingPath);
  //   }
  //   this.setLogToFileLevel('error');
  //   this.setLogFileName('express.log');
  // }

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

  // setFileLogging(options: { level?: elog.LevelOption, fileName?: string }) {
  //   this.setLogToFileLevel(options['level']);
  //   this.setLogFileName(options['fileName']);
  //   return this.logger;
  // }

  // setLogFileName(fileName: string) {
  //   this.logger.transports.file.file = path.join(this.loggingPath, fileName);
  //   return this;
  // }

  // setLogToFileLevel(level: string) {
  //   this.logger.transports.file.level = level;
  //   return this;
  // }

  // setLogToConsoleLevel(level: string) {
  //   this.logger.transports.console.level = level;
  //   return this;
  // }

  getLogger() {
    return this.logger;
  }
}

export default new Logger().getLogger();
