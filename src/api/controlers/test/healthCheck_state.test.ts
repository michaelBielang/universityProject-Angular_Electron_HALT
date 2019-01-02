/**
 * @author Michael Bielang, Christoph Bichlmeier
 * @license UNLICENSED
 */

import 'mocha';
import {expect} from 'chai';
import * as server from '../../server';
import * as request from 'supertest';
import * as db from '../../datastorage/dbInterface';


describe('test healthcheck', function () {

  this.timeout(10000);
  it('test should return 200', async function () {

    await db.dbFunctions.initDbCon();
    return request(server.default.api)
      .get('/api/healthcheck/')
      .then(res => {
        const status = res.status === 200;
        expect(status).to.eql(true);
      }).then(() => {
        server.default.apiObj.close();
      }).catch(err => {
        console.log('error: \n' + err);
        server.default.apiObj.close();
      });
  });
});
