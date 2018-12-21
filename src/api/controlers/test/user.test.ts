/**
 * @author Michael Bielang, Christoph Bichlmeier
 * @license UNLICENSED
 */

import 'mocha';
import {expect} from 'chai';
import * as server from '../../server';
import * as request from 'supertest';
import {createTableStatements} from '../../datastorage/data';
import * as db from '../../datastorage/dbInterface';

describe('test clear history', function () {


  this.timeout(10000);
  it('test history should be completed', async function () {

    await db.dbFunctions.initDbCon();
    await db.dbFunctions.dropAll();
    await db.dbFunctions.createTable(createTableStatements.user);
    await db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email');
    return request(server.default.api)
      .get('/api/users/1')
      .then(res => {
        expect(res.status).to.eql(200);
      }).then(() => {
        server.default.apiObj.close();
      }).catch(err => console.log('error: \n' + err));
  });
});


// test username valid && rzKennung invalid
// test username invalid && rzkennung invalid
// test rzKennung valid && username invalid

