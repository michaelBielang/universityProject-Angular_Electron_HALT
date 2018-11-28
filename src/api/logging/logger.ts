/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import * as path from 'path';
import * as fs from 'fs';
import * as elog from 'electron-log';

export class Logger {
  private loggingPath = path.join(__dirname, 'logging');
  private logger: any;

  constructor(elogInstance) {
    this.logger = elogInstance;
    if (!fs.existsSync(this.loggingPath)) {
      fs.mkdirSync(this.loggingPath);
    }
    this.setLogToFileLevel('info');
    this.setLogFileName('express.log');
  }

  setFileLogging(options: { level?: elog.LevelOption, fileName?: string }) {
    this.setLogToFileLevel(options['level']);
    this.setLogFileName(options['fileName']);
    return this.logger;
  }

  setLogFileName(fileName: string) {
    this.logger.transports.file.file = path.join(this.loggingPath, fileName);
    return this;
  }

  setLogToFileLevel(level: elog.LevelOption) {
    this.logger.transports.file.level = level;
    return this;
  }

  setLogToConsoleLevel(level: elog.LevelOption) {
    this.logger.transports.console.level = level;
    return this;
  }

  getLogger() {
    return this.logger;
  }
}

export default new Logger(elog).getLogger();
