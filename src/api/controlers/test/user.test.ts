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
  it('test username valid', async function () {

    await db.dbFunctions.initDbCon();
    await db.dbFunctions.dropAll();
    await db.dbFunctions.createTable(createTableStatements.user);
    await db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email');
    return request(server.default.api)
      .get('/api/users/1')
      .then(res => {
        const status = res.status === 200;
        const nameValid = res.body.userObj.first_name === 'firstName';
        expect(status && nameValid).to.eql(true);
      }).then(() => {
        server.default.apiObj.close();
      }).catch(err => {
        console.log('error: \n' + err);
        server.default.apiObj.close();
      });
  });
});


describe('test clear history', function () {

  this.timeout(10000);
  it('test rzKennung valid', async function () {

    await db.dbFunctions.initDbCon();
    await db.dbFunctions.dropAll();
    await db.dbFunctions.createTable(createTableStatements.user);
    await db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email@email.de');
    return request(server.default.api)
      .get('/api/users/1')
      .then(res => {
        const status = res.status === 200;
        const emailValid = res.body.userObj.e_mail === 'email@email.de';
        expect(status && emailValid).to.eql(true);
      }).then(() => {
        server.default.apiObj.close();
      }).catch(err => {
        console.log('error: \n' + err);
        server.default.apiObj.close();
      });
  });
});

describe('test clear history', function () {

  this.timeout(10000);
  it('test nothing valid', async function () {

    await db.dbFunctions.initDbCon();
    await db.dbFunctions.dropAll();
    await db.dbFunctions.createTable(createTableStatements.user);
    return request(server.default.api)
      .get('/api/users/1')
      .then(res => {
        expect(res.status).to.eql(404);
      }).then(() => {
        server.default.apiObj.close();
      }).catch(err => {
        console.log('error: \n' + err);
        server.default.apiObj.close();
      });
  });
});

