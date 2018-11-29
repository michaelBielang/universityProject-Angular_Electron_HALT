/**
 * @author Christoph Bichlmeier, Steffen Schmid
 * @license UNLICENSED
 */

import * as express from 'express';

import {
  auth_login,
} from '../controlers/auth.controler';

class AuthRoutes {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const userRoutes = express.Router();

    userRoutes.post('/', auth_login);

    this.express.use('/', userRoutes);
  }

  getExpressRef() {
    return this.express;
  }
}

export default new AuthRoutes().express;
