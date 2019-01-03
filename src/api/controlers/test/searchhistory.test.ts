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


describe('test history', function () {

  this.timeout(10000);
  it('test history entry available', async function () {

    await db.dbFunctions.initDbCon();
    await db.dbFunctions.dropAll();
    await db.dbFunctions.createTable(createTableStatements.user);
    await db.dbFunctions.createTable(createTableStatements.history);
    await db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email');
    await db.dbFunctions.addHistory(1, 2, 'Elena', 'elena@email.de', 'Kunst', 'malen', 1);

    return request(server.default.api)
      .get('/api/searchhistories/1')
      .then(res => {
        const status = res.status === 200;
        const nameValid = res.body.historyObjs[0].e_mail === 'elena@email.de';
        expect(status && nameValid).to.eql(true);
      }).then(() => {
        server.default.apiObj.close();
      }).catch(err => {
        console.log('error: \n' + err);
        server.default.apiObj.close();
      });
  });
});


describe('test history', function () {

  this.timeout(10000);
  it('test history not available', async function () {

    await db.dbFunctions.initDbCon();
    await db.dbFunctions.dropAll();
    await db.dbFunctions.createTable(createTableStatements.user);
    await db.dbFunctions.createTable(createTableStatements.history);
    await db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email');

    return request(server.default.api)
      .get('/api/searchhistories/1')
      .then(res => {
        expect(false).to.eql(true);
      }).then(() => {
        server.default.apiObj.close();
      }).catch(err => {
        //should reach this part since reject should be returned
        expect(true).to.eql(true);
        server.default.apiObj.close();
      });
  });
});

describe('test history', function () {

  this.timeout(10000);
  it('test history user not present', async function () {

    await db.dbFunctions.initDbCon();
    await db.dbFunctions.dropAll();
    await db.dbFunctions.createTable(createTableStatements.user);
    await db.dbFunctions.createTable(createTableStatements.history);
    await db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email');

    return request(server.default.api)
      .get('/api/searchhistories/2')
      .then(res => {
        expect(false).to.eql(true);
      }).then(() => {
        server.default.apiObj.close();
      }).catch(err => {
        //should reach this part since reject should be returned
        expect(true).to.eql(true);
        server.default.apiObj.close();
      });
  });
});


