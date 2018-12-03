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
const db = require('../datastorage.js')


describe('test database', function () {

  describe('test add user', function () {
    it('should return a promise', () => {
      expect(db.tablePresent('user')).to.eql(false)
      /*      const usersUpResult = User.up()
            expect(usersUpResult.then).to.be.a('Function')
            expect(usersUpResult.catch).to.be.a('Function')*/
    })
  })
  //this.timeout(9000)

})
