/**
 * Created by Michael Bielang on 28.11.2018.
 * www.codemerger.com
 * bielang@codemerger.com
 *
 * Project:
 * java version "10.0.1"
 */

'use strict'

const exec = require('child_process').exec
const path = require('path')
const request = require('request')
const expect = require('chai').expect
const createTableStatements = require('../data')

describe('test user present', function () {

  let db
  before(function () {
    db = require('../dbInterface')
  })

  it('should work', function () {

    db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
      .then(resolve => { return db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email')})
      .then(resolve => {
        return db.dbFunctions.userPresent('1')
      }).then(resolve => {
      expect(resolve.toString()).to.eql('true')
    }, reject => expect(reject.toString()).to.eql('true')).then(resolve => db.dbFunctions.dropAll())
  })


})
