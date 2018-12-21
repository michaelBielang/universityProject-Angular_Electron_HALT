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
import {after, before} from 'selenium-webdriver/testing';

describe('test clear history', function () {

  before(async function () {
    await db.dbFunctions.initDbCon();
    await db.dbFunctions.dropAll();
  });

  this.timeout(10000);
  it('test history should be completed', async function () {

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

  after(async function f() {
    await db.dbFunctions.dropAll();
  });
});


// test username valid && rzKennung invalid
// test username invalid && rzkennung invalid
// test rzKennung valid && username invalid

