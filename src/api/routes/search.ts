/**
 * @author Christoph Bichlmeier, Steffen Schmid
 * @license UNLICENSED
 */

import * as express from 'express';


import {
  search_exec,
} from '../controlers/search.controler';

class SearchRoutes {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const userRoutes = express.Router();

    userRoutes.post('/', search_exec);

    this.express.use('/', userRoutes);
  }

  getExpressRef() {
    return this.express;
  }
}

export default new SearchRoutes().express;
