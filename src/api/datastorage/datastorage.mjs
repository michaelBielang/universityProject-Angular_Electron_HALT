/**
 * Created by Michael Bielang on 27.11.2018.
 * www.codemerger.com
 * bielang@codemerger.com
 *
 * Project:
 * java version "10.0.1"
 */

'use strict'

import { createTables } from './tables'

/** @noinspection SqlResolve */
const sqlConnection = require('sqlite3').verbose()
//const dbImport = require('./tables')

//open database --> uses create/readwrite per default
let db = new sqlConnection.Database('test.db', (err) => {
  if (err) {
    console.error('Error connecting to database')
  }
  console.log('Connected to the chinook database.')
})

/*
const insertPlayerOne = 'INSERT INTO PLAYERS (ID, first_name, last_name) VALUES (1, "player", "one")'
const insertPlayerTwo = 'INSERT INTO PLAYERS (ID, first_name, last_name) VALUES (1, "player", "one")'
*/

function init_db () {
  let ok = true
  if (!tablePresent('user')) {
    createTable(createTablesExport.user)
      .then(resolve => {
        createTable(createTablesExport.history)
      }).then(resolve => {
      createTable(createTablesExport.LDAP_ServerGroup)
    }).then(resolve => {
      createTable(createTablesExport.studySubject)
    }).then(resolve => {
      createTable(createTablesExport.VPN_ServerConfig)
    }).catch(reject => {
      console.log('Error init DB')
      ok = false
    })
  }
  return ok
}

function createTable (table) {
  return new Promise((resolve, reject) => {
    db.run(table, err => {
      if (err) {
        console.log('error in create Table: ' + err)
        reject()
        return
      }
      console.log('Ok')
      resolve('creating table ok')
    })
  })
}

function tablePresent (table_name) {
  console.log('table present called')
  let returnValue = true
  db.run('SELECT * FROM (?)', table_name, (err) => {
    if (err) {
      returnValue = false
      console.log('Error')
      return
    }
  })
  return returnValue
}

createTable(createTables.user)

function dropTable (table) {
  //db.prepare prevents SQL injection hacks
  console.log('prepare statement')
  const statement = 'DROP TABLE ' + table
  return new Promise((resolve, reject) => {
    db.run(statement, err => {
      if (err) {
        console.log('Error dropping table:' + err)
        reject()
        return
      }
      console.log('Success dropping table')
      resolve('Success')
    })
  })
}

function dropAll () {
  return new Promise((resolve) => {
    dropTable('PLAYERS')
      .then(resolve => {
        console.log('reached resolved')
      }, onReject => {
        console.log('reject part')
      })
  })
}

function addUser (firstName, lastName, eMail) {
  return new Promise(((resolve, reject) => {
    // noinspection SqlResolve
    const statement = 'INSERT INTO user(first_name, last_name, e_mail, last_login) VALUES (? ,? ,?, ?)'
    db.run(statement, [firstName, lastName, eMail], (err) => {

    })
  }))
}

function deleteUser () {

}

/*
console.log(tablePresent('players'))

dropTable('players').then(resolve => {

}, reject => {

})*/
