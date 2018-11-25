/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
// import * as cors from 'cors';
import env from './server-env';

// Subroutes
import userRoutes from './routes/users';

class Api {
  private express;

  constructor() {
    this.express = express();
    this.addMiddlewares();
    this.mountSubRoutes();
    this.mountApiRoutes();
    this.errorRoutes();
  }

  private addMiddlewares(): void {
    if (env.mode === 'dev') {
      // Morgan logger
      this.express.use(logger('dev'));
    }
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(bodyParser.json());

    // const urlOrigins = [
    //   'http://localhost',
    //   'http://127.0.0.1'
    // ];
    //
    // this.express.use(cors(
    //   {
    //     'origin': function(origin, callback) {
    //       if (origin) {
    //         const originArr = origin.split(':');
    //         let corsAllowed = false;
    //         for (let i = 0; i < urlOrigins.length; ++i) {
    //           if ((originArr[0] + ':' + originArr[1]).indexOf(urlOrigins[i]) !== -1) {
    //             corsAllowed = true;
    //             break;
    //           }
    //         }
    //         if (corsAllowed) {
    //           callback(undefined, true);
    //         } else {
    //           console.info(origin + ' not allowed by CORS');
    //           callback(new Error('Not allowed by CORS'));
    //         }
    //       } else {
    //         callback(undefined, true);
    //       }
    //     },
    //     'credentials': false, // does not need any cookies
    //     'methods': 'GET,PATCH,POST,DELETE',
    //     'preflightContinue': false,
    //     'optionsSuccessStatus': 204
    //   }
    // ));
  }

  private mountSubRoutes(): void {
    this.express.use('/api/users', userRoutes);
  }

  private mountApiRoutes(): void {
    const apiRoutes = express.Router();
    apiRoutes.get('/api/', (req, res) => {
      res.json({
        message: 'Welcome, this is an API for the Hochschul Active Directory Lookup Tool',
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

  getExpressRef() {
    return this.express;
  }
}

export default new Api().getExpressRef();
