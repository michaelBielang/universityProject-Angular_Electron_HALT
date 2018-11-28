/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import * as express from 'express';

import {
  user_index,
  user_show,
  user_create,
  user_update,
  user_delete
} from '../controlers/user.controler';

class UsersRoutes {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const userRoutes = express.Router();

    // Get all users with limit and offset
    userRoutes.get('/', user_index);

    // get specific user
    userRoutes.get('/:userid', user_show);

    // create new user
    userRoutes.post('/',  user_create);

    // Update user attributes
    userRoutes.patch('/:userid', user_update);

    // Remove specific user
    userRoutes.delete('/:userid', user_delete);

    this.express.use('/', userRoutes);
  }

  getExpressRef() {
    return this.express;
  }
}

export default new UsersRoutes().express;
