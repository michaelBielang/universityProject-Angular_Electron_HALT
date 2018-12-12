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
  const db = require('../dbInterface')

  before(async function () {
    await db.dbFunctions.initDbCon()
    await db.dbFunctions.dropAll()
  })

  it('should work', function () {
    expect(db.dbFunctions.getSubjects('hsa', 'Informatik')).to.be.an('array').that.does.include('Applied Research (Master)')
  })
})

describe('test get faculties', function () {

  const db = require('../dbInterface')

  before(async function () {
    await db.dbFunctions.initDbCon()
    await db.dbFunctions.dropAll()
  })

  it('should work', function () {
    expect(db.dbFunctions.getFaculties('hsa')).to.be.an('array').that.does.include('Informatik')
  })

  after(async function () {
    await db.dbFunctions.dropAll()
  })
})

describe('test get history present', function () {

  const db = require('../dbInterface')

  before(async function () {
    await db.dbFunctions.initDbCon()
    await db.dbFunctions.dropAll()
  })

  it('test history should be completed', function () {

    return db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
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
        expect(JSON.stringify(result).includes('informatik')).to.equal(true)
      }).catch(reject => {
          // logic of false == true: if reject -> show test failed
          expect((false).to.equal(true))
        }
      )
  })

  after(async function () {
    await db.dbFunctions.dropAll()
  })
})

describe('test get history not present', function () {

  const db = require('../dbInterface')

  before(async function () {
    await db.dbFunctions.initDbCon()
    await db.dbFunctions.dropAll()
  })
  it('test history should be completed', function () {
    return db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
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
      }).catch(reject => {
          // logic of false == true: if reject -> show test failed
          expect((false).to.equal(true))
          return db.dbFunctions.dropAll()
        }
      )
  })

  after(async function () {
    await db.dbFunctions.dropAll()
  })
})

describe('test update user', function () {
  const db = require('../dbInterface')

  before(async function () {
    await db.dbFunctions.initDbCon()
    await db.dbFunctions.dropAll()
  })
  it('test history should be completed', function () {
    return db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
      .then(() => {
        return db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email')
      })
      .then(resolve => {
        return db.dbFunctions.updateUser('email')
      })
      .then(result => {
        // if rejected this will not be called
        expect(true).to.equal(true)
      }).catch(reject => {
          // logic of false == true: if reject -> show test failed
          expect((false).to.equal(true))
          return db.dbFunctions.dropAll()
        }
      )
  })

  after(async function () {
    await db.dbFunctions.dropAll()
  })
})

describe('test remove last history entry', function () {
  const db = require('../dbInterface')

  before(async function () {
    await db.dbFunctions.initDbCon()
    await db.dbFunctions.dropAll()
  })

  it('test history should complete', async function () {

    this.timeout(10000)
    await db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
    await db.dbFunctions.createTable(createTableStatements.createTableStatements.history)
    await db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email')
    await db.dbFunctions.addHistory(1, 2, 'firstName', 'lastName', 'email', 'toBeDeleted', 'toBeDeleted', 'hsa', 'm')
    await new Promise(resolve => setTimeout(resolve, 1500))
    await db.dbFunctions.addHistory(1, 2, 'firstName', 'lastName', 'email', 'NoDelete', 'NoDelete', 'hsa', 'm')
    await new Promise(resolve => setTimeout(resolve, 1500))
    await db.dbFunctions.addHistory(1, 2, 'firstName', 'lastName', 'email', 'NoDelete', 'NoDelete', 'hsa', 'm')
    await db.dbFunctions.deleteLastHistoryEntry(1)
    await db.dbFunctions.getHistory(1).then(resolve => {
      expect(JSON.stringify(resolve).includes('NoDelete')).to.equal(true)
    })
  })

  after(async function () {
    await db.dbFunctions.dropAll()
  })
})

describe('test clear history', function () {
  const db = require('../dbInterface')

  before(async function () {
    await db.dbFunctions.initDbCon()
    await db.dbFunctions.dropAll()
  })

  it('test history should complete', async function () {

    this.timeout(10000)
    await db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
    await db.dbFunctions.createTable(createTableStatements.createTableStatements.history)
    await db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email')
    await db.dbFunctions.addHistory(1, 2, 'firstName', 'lastName', 'email', 'toBeDeleted', 'toBeDeleted', 'hsa', 'm')
    await new Promise(resolve => setTimeout(resolve, 1500))
    await db.dbFunctions.addHistory(1, 2, 'firstName', 'lastName', 'email', 'NoDelete', 'NoDelete', 'hsa', 'm')
    await new Promise(resolve => setTimeout(resolve, 1500))
    await db.dbFunctions.addHistory(1, 2, 'firstName', 'lastName', 'email', 'NoDelete', 'NoDelete', 'hsa', 'm')
    await db.dbFunctions.clearHistory()
    await db.dbFunctions.getHistory(1).then(resolve => {
      expect(JSON.stringify(resolve).includes('NoDelete')).to.equal(false)
    })
  })

  after(async function () {
    await db.dbFunctions.dropAll()
  })

})

describe('test add user', function () {
  const db = require('../dbInterface')

  before(async function () {
    await db.dbFunctions.initDbCon()
    await db.dbFunctions.dropAll()
  })

  it('test history should complete', async function () {

    this.timeout(10000)
    await db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
    await db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email')
    await db.dbFunctions.userPresent(1).then(resolve => {
      expect(resolve).to.equal(true)
    })
  })

  after(async function () {
    await db.dbFunctions.dropAll()
  })
})

describe('test delete user', function () {
  const db = require('../dbInterface')

  before(async function () {
    await db.dbFunctions.initDbCon()
    await db.dbFunctions.dropAll()
  })

  it('test history should complete', async function () {

    await db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
    await db.dbFunctions.addUser(1, 'firstName', 'lastName', 'email')
    await db.dbFunctions.deleteUser(1)
    await db.dbFunctions.userPresent(1).then(resolve => {
      expect(resolve).to.equal(false)
    })
  })

  after(async function () {
    await db.dbFunctions.dropAll()
  })
})

describe('test table not present', function () {
  const db = require('../dbInterface')

  before(async function () {
    await db.dbFunctions.initDbCon()
    await db.dbFunctions.dropAll()
  })

  it('test history should complete', async function () {

    await db.dbFunctions.tablePresent(createTableStatements.createTableStatements.user).then(resolve => {
      expect(resolve).to.equal(false)
    })
  })

  after(async function () {
    await db.dbFunctions.dropAll()
  })
})

describe('test table present', function () {
  const db = require('../dbInterface')

  before(async function () {
    await db.dbFunctions.initDbCon()
    await db.dbFunctions.dropAll()
  })

  it('test history should complete', async function () {

    await db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
    await db.dbFunctions.tablePresent('user').then(resolve => {
      expect(resolve).to.equal(true)
    })
  })

  after(async function () {
    await db.dbFunctions.dropAll()
  })
})

describe('test get user', function () {

  const db = require('../dbInterface')

  before(async function () {
    await db.dbFunctions.initDbCon()
    await db.dbFunctions.dropAll()
  })

  it('should work', function () {
    return db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
      .then(() => {
        return db.dbFunctions.addUser('1', 'firstName', 'lastName', 'email')
      })
      .then(resolve => {
        return db.dbFunctions.getUser('email', undefined)
      })
      .then(resolve => {
        expect(JSON.stringify(resolve).includes('firstName')).to.equal(true)
      })
      .catch(err => {
        // logic of false == true: if reject -> show test failed
        expect((false).to.equal(true))
        console.log(err)
      })
  })

  after(async function () {
    await db.dbFunctions.dropAll()
  })
})

describe('test user present true', function () {

  const db = require('../dbInterface')

  before(async function () {
    await db.dbFunctions.initDbCon()
    await db.dbFunctions.dropAll()
  })

  // it doesn't need a catch statement since userPresent is forced to resolve with either true/false
  it('should test true', function () {
    return db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
      .then(resolve => {
        return db.dbFunctions.addUser('1', 'firstName', 'lastName', 'email')
      }).then(resolve => {
        return db.dbFunctions.userPresent('1')
      }).then(resolve => {
        expect(resolve.toString()).to.eql('true')
      })
  })

  after(async function () {
    await db.dbFunctions.dropAll()
  })
})

describe('test user present false', function () {
  const db = require('../dbInterface')

  before(async function () {
    await db.dbFunctions.initDbCon()
    await db.dbFunctions.dropAll()
  })

  // it doesn't need a catch statement since userPresent is forced to resolve with either true/false
  it('should test false', function () {
      return db.dbFunctions.createTable(createTableStatements.createTableStatements.user)
        .then(resolve => {
          return db.dbFunctions.addUser('1', 'firstName', 'lastName', 'email')
        }).then(resolve => {
          return db.dbFunctions.userPresent('2')
        }).then(resolve => {
          expect(resolve).to.eql(false)
        })
    }
  )

  after(async function () {
    await db.dbFunctions.dropAll()
  })
})


