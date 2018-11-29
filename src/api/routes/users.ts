/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import * as express from 'express';

import {
  user_show,
} from '../controlers/user.controler';

class UsersRoutes {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const userRoutes = express.Router();

    userRoutes.get('/:userid', user_show);

    this.express.use('/', userRoutes);
  }

  getExpressRef() {
    return this.express;
  }
}

export default new UsersRoutes().express;
