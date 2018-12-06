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

//done
/*describe('test get subjects', function () {

  let db
  before(function () {
    db = require('../dbInterface')
  })

  it('should work', function () {
    expect(db.dbFunctions.getSubjects('hsa', 'Informatik')).to.be.an('array').that.does.include('Applied Research (Master)')
  })
})*/

//done
/*describe('test get faculties', function () {

  let db
  before(function () {
    db = require('../dbInterface')
  })

  it('should work', function () {
    expect(db.dbFunctions.getFaculties('hsa')).to.be.an('array').that.does.include('Informatik')
  })
})*/

//done
describe('test get history', function () {

  const db = require('../dbInterface')
  it('test', function () {
    db.dbFunctions.dropAll()
      .then(onResolve => {
          return db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
        }
      )
      .then(resolve => {
        console.log('success create user')
        db.dbFunctions.createTable(createTableStatements.createTableStatements.history)
      })
      .then(() => {
        console.log('success create history')
        return db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email')
      })
      .then(() => {
        console.log('success add user')
        return db.dbFunctions.addHistory(1, 2, 'firstName', 'lastName', 'email', 'informatik', 'informatik', 'hsa', 'm')
      })
      .then(() => {
        console.log('success add history')
        return db.dbFunctions.addHistory(1, 2, 'firstName', 'lastName', 'email', 'Mathe', 'Mathe', 'hsa', 'm')
      })
      .then(resolve => {
        console.log('call')
        return db.dbFunctions.getHistory(1)
      })
      .then(result => {
        console.log('type of: ' + typeof result)
        expect(result.includes('informatik')).to.equal(true)
      }).catch(err => console.log(err))
  })
})

/*
describe('test remove last history entry', function () {



})

describe('test clear history', function () {


})

describe('test add history', function () {


})

describe('test show table content', function () {


})

describe('test delete user', function () {

})

describe('test add user', function () {


})

describe('test drop table', function () {

})

describe('test table present', function () {

})

describe('test create table', function () {


})

describe('test get user', function () {

})

describe('test update user', function () {


})
*/

//done
/*
describe('test user present', function () {

  let db
  before(function () {
    db = require('../dbInterface')
  })

  it('should test true', function () {
    db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
      .then(resolve => { return db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email')})
      .then(resolve => {
        return db.dbFunctions.userPresent('1')
      }).then(resolve => {
      expect(resolve.toString()).to.eql('true')
    }).then(resolve => db.dbFunctions.dropAll())
      .catch(reject => db.dbFunctions.dropAll())
  })

  describe('test false', () => {
    it('should test false', function () {

      db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
        .then(resolve => { return db.dbFunctions.addUser(2, 'firstName', 'lastName', 'email')})
        .then(resolve => {
          return db.dbFunctions.userPresent('1')
        }).then(resolve => {
        expect(resolve.toString()).to.eql('false')
      }).then(resolve => db.dbFunctions.dropAll())
    })
  })
})
*/
