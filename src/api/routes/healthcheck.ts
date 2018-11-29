/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import * as express from 'express';

import {
  healthcheck_state,
} from '../controlers/healthcheck.controler';

class HealthCheckRoutes {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const userRoutes = express.Router();

    userRoutes.get('/', healthcheck_state);

    this.express.use('/', userRoutes);
  }

  getExpressRef() {
    return this.express;
  }
}

export default new HealthCheckRoutes().express;
