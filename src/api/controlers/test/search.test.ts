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

// TODO
describe('test history', function () {

  this.timeout(10000);
  it('test history entry available', async function () {

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

    return request(server.default.api)
      .post('/api/search/1')
      .send(searchObj)
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

