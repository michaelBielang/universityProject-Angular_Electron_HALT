/**
 * @author Christoph Bichlmeier, Steffen Schmid
 * @license UNLICENSED
 */

import * as express from 'express';

import {
  servergroup_index,
  servergroup_show,
} from '../controlers/servergroup.controler';

class SearchHistoryRoutes {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const userRoutes = express.Router();

    userRoutes.get('/', servergroup_index);

    userRoutes.get('/:groupname', servergroup_show);

    this.express.use('/', userRoutes);
  }

  getExpressRef() {
    return this.express;
  }
}

export default new SearchHistoryRoutes().express;
