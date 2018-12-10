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

describe('test get subjects', function () {
  let db
  before(function () {
    db = require('../dbInterface')
  })
  it('should work', function () {
    expect(db.dbFunctions.getSubjects('hsa', 'Informatik')).to.be.an('array').that.does.include('Applied Research (Master)')

  })
})

describe('test get faculties', function () {

  let db
  before(function () {
    db = require('../dbInterface')
  })
  it('should work', function () {
    expect(db.dbFunctions.getFaculties('hsa')).to.be.an('array').that.does.include('Informatik')
  })
})

describe('test get history present', function () {

  const db = require('../dbInterface')
  it('test history should be completed', function () {
    return db.dbFunctions.dropAll()
      .then(onResolve => {
          return db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
        }
      )
      .then(resolve => {
        db.dbFunctions.createTable(createTableStatements.createTableStatements.history)
      })
      .then(() => {
        return db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email')
      })
      .then(() => {
        return db.dbFunctions.addHistory(1, 2, 'firstName', 'lastName', 'email', 'informatik', 'informatik', 'hsa', 'm')
      })
      .then(() => {
        return db.dbFunctions.addHistory(1, 2, 'firstName', 'lastName', 'email', 'Mathe', 'Mathe', 'hsa', 'm')
      })
      .then(resolve => {
        return db.dbFunctions.getHistory(1)
      })
      .then(result => {
        console.log(result)
        expect(result.includes('informatik')).to.equal(true)
      }).then(resolve => {
        function dropNow () {
          return db.dbFunctions.dropAll()
        }

        awaitDrop()

        async function awaitDrop () {
          await dropNow()

          return Promise.resolve()
        }
      }).catch(reject => {
          function dropNow () {
            return db.dbFunctions.dropAll()
          }

          awaitDrop()

          async function awaitDrop () {
            await dropNow()
            resolve1()
          }
        }
      )
  })
})

describe('test get history not present', function () {

  const db = require('../dbInterface')
  it('test history should be completed', function () {
    return db.dbFunctions.dropAll()
      .then(onResolve => {
          return db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
        }
      )
      .then(resolve => {
        db.dbFunctions.createTable(createTableStatements.createTableStatements.history)
      })
      .then(() => {
        return db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email')
      })
      .then(resolve => {
        return db.dbFunctions.getHistory(1)
      })
      .then(result => {
        expect(result.includes('informatik')).to.equal(false)
      }).then(resolve => {
        function dropNow () {
          return db.dbFunctions.dropAll()
        }

        awaitDrop()

        async function awaitDrop () {
          await dropNow()

          return Promise.resolve()
        }
      }).catch(reject => {
          function dropNow () {
            return db.dbFunctions.dropAll()
          }

          awaitDrop()

          async function awaitDrop () {
            await dropNow()
            resolve1()
          }
        }
      )
  })
})

describe('test update user', function () {

})

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

describe('test table present', function () {

})

describe('test create table', function () {

})

describe('test get user', function () {
  const db = require('../dbInterface')
  it('should work', function () {
    return db.dbFunctions.dropAll()
      .then(onResolve => {
        return db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
      })
      .then(() => {
        return db.dbFunctions.addUser('1', 'firstName', 'lastName', 'email')
      })
      .then(resolve => {
        return db.dbFunctions.getUser('email', undefined)
      })
      .then(resolve => {
        expect(resolve.includes('firstName')).to.equal(true)
        return db.dbFunctions.dropAll()
      })
      .catch(err => console.log(err))
  })
})

describe('test user present true', function () {
  const db = require('../dbInterface')
  it('should test true', function () {
    return db.dbFunctions.dropAll().then(resolve => {
      return db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
    }).then(resolve => {
      return db.dbFunctions.addUser('1', 'firstName', 'lastName', 'email')
    }).then(resolve => {
      return db.dbFunctions.userPresent('1')
    }).then(resolve => {
      expect(resolve.toString()).to.eql('true')
    }).then(resolve => {
      return db.dbFunctions.dropAll()
    })
  })
})

describe('test user present false', function () {
  const db = require('../dbInterface')
  it('should test false', function () {
      return db.dbFunctions.dropAll().then(resolve => {
        return db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
      }).then(resolve => {
        return db.dbFunctions.addUser('1', 'firstName', 'lastName', 'email')
      }).then(resolve => {
        return db.dbFunctions.userPresent('2')
      }).then(resolve => {

        console.log('result: ' + resolve)
        expect(resolve.toString()).to.eql('false')
      }).then(resolve => {
        return db.dbFunctions.dropAll()
      })
    }
  )
})


