/**
 * @author Christoph Bichlmeier, Steffen Schmid
 * @license UNLICENSED
 */

import * as express from 'express';

import {
  searchhistory_index,
  searchhistory_show,
  searchhistory_create,
} from '../controlers/searchhistory.controler';

class SearchHistoryRoutes {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const userRoutes = express.Router();

    userRoutes.get('/', searchhistory_index);

    userRoutes.get('/:searchhistoryid', searchhistory_show);

    userRoutes.post('/', searchhistory_create);

    this.express.use('/', userRoutes);
  }

  getExpressRef() {
    return this.express;
  }
}

export default new SearchHistoryRoutes().express;
