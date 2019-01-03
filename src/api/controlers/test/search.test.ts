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
import ISearchObj from '../models/search-obj.model';

describe('test search', function () {

  this.timeout(10000);
  it('test should work', async function () {

    await db.dbFunctions.initDbCon();
    await db.dbFunctions.dropAll();
    await db.dbFunctions.createTable(createTableStatements.user);
    await db.dbFunctions.createTable(createTableStatements.history);
    await db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email');
    const searchObj: ISearchObj = {
      gender: 1,
      id: 1,
      name: 'Elena',
      email: 'elena@email.de',
      faculty: 'Kunst',
      subjectordegree: 'malen',
    };

    // use strg + c to terminate this test manually (seem to hang due to ldap search process)
    return request(server.default.api)
      .post('/api/search/1')
      .send(searchObj)
      .then(res => {
        const status = res.status === 200;
        const contentAvailable = (res.body.message).includes('Search successful');
        expect(status && contentAvailable).to.eql(true);
      }).then(() => {
        server.default.apiObj.close();
      }).catch(err => {
        console.log('error: \n' + err);
        server.default.apiObj.close();
      });
  });
});

