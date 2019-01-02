/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import * as express from 'express';
import * as morganLogger from 'morgan';
import logger from './logging/logger';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import env from './server-env';
import * as db from './datastorage/dbInterface';

// Subroutes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import searchRoutes from './routes/search';
import searchHistoryRoutes from './routes/searchhistories';
import facultyRoutes from './routes/faculties';
import healthCheckRoutes from './routes/healthcheck';

class Api {
  public express: any;

  constructor() {
    db.dbFunctions.initDbCon(env.mode).catch(err => {
      logger.error(err);
    });
    this.express = express();
    this.addMiddlewares();
    this.mountSubRoutes();
    this.mountApiRoutes();
    this.errorRoutes();
  }

  private addMiddlewares(): void {
    if (env.mode === 'dev') {
      this.express.use(morganLogger('dev')); // Use Morgan logger
    }
    this.express.use(bodyParser.urlencoded({extended: false}));
    this.express.use(bodyParser.json());

    const urlOrigins = [
      'http://localhost',
      'http://127.0.0.1',
      'file://'
    ];

    this.express.use(cors(
      {
        'origin': function (origin, callback) {
          if (origin) {
            const originArr = origin.split(':');
            let corsAllowed = false;
            for (let i = 0; i < urlOrigins.length; ++i) {
              if ((originArr[0] + ':' + originArr[1]).indexOf(urlOrigins[i]) !== -1) {
                corsAllowed = true;
                break;
              }
            }
            if (corsAllowed) {
              callback(undefined, true);
            } else {
              console.info(origin + ' not allowed by CORS');
              callback(new Error('Not allowed by CORS'));
            }
          } else {
            callback(undefined, true);
          }
        },
        'credentials': true,
        'methods': 'GET,PATCH,POST,DELETE',
        'preflightContinue': false,
        'optionsSuccessStatus': 204
      }
    ));
  }

  private mountSubRoutes(): void {
    this.express.use('/api/auth', authRoutes);
    this.express.use('/api/users', userRoutes);
    this.express.use('/api/search', searchRoutes);
    this.express.use('/api/searchhistories', searchHistoryRoutes);
    this.express.use('/api/faculties', facultyRoutes);
    this.express.use('/api/healthcheck', healthCheckRoutes);
  }

  private mountApiRoutes(): void {
    const apiRoutes = express.Router();
    apiRoutes.get('/api/', (req, res) => {
      res.json({
        message: 'Welcome! This is an API for the Hochschul Active Directory Lookup Tool',
      });
    });
    this.express.use('/', apiRoutes);
  }

  private errorRoutes(): void {
    this.express.use((req, res, next) => {
      const error: { status?: number, message: string } = new Error('Route not available');
      error.status = 404;
      next(error);
    });

    this.express.use((error, req, res, next) => {
      res.status(error.status || 500);
      res.json({
        error: {
          message: error.message,
        }
      });
    });
  }
}

export default new Api().express;
