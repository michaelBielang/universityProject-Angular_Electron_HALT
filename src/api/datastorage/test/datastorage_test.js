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

describe('test database', function () {

  let db
  before(function () {
    db = require('../dbInterface')
  })
  it('should work', function () {
    expect(db.userPresent(1)).to.eql('true')
  })

})
