/**
 * @author Christoph Bichlmeier, Steffen Schmid
 * @license UNLICENSED
 */

import * as express from 'express';

import {
  searchHistory_index,
} from '../controlers/searchhistory.controler';

class SearchHistoryRoutes {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const userRoutes = express.Router();

    userRoutes.get('/:userid', searchHistory_index);

    this.express.use('/', userRoutes);
  }

  getExpressRef() {
    return this.express;
  }
}

export default new SearchHistoryRoutes().express;
