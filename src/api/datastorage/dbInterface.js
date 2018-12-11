/**
 * Created by Michael Bielang on 27.11.2018.
 * www.codemerger.com
 * bielang@codemerger.com
 *
 * Project:
 * java version "10.0.1"
 */

'use strict'

/** @noinspection SqlResolve */
const fs = require('fs')
const sqlConnection = require('sqlite3').verbose()
const data = require('./data.js')
const path = require('path')
const dateManager = require('date-and-time')
const dbPath = path.join(__dirname, 'db/halt.db')

//open database --> uses create/readwrite per default

let db

function initDbCon () {
  return new Promise((resolve, reject) => {
    getDbConnection().then(connection => {
      db = connection
      resolve(db)
      //init_db() todo
    }).catch(err => {
      reject(err)
    })
  })
}

function getDbConnection () {
  const targetPath = path.dirname(dbPath)
  if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath)
  return new Promise((resolve, reject) => {
    const con = new sqlConnection.Database(dbPath, (err) => {
      console.log(dbPath)
      if (err) {
        console.error('Error connecting to database')
        reject(err)
      } else {
        console.log('Connected to the chinook database.')
        resolve(con)
      }
    })
  })
}

//todo ggf
//const logger = require('../logging/logger.js')

exports.dbFunctions = {
  initDbCon: initDbCon,
  updateUser: updateUser,
  getUser: getUser,
  userPresent: userPresent,
  createTable: createTable,
  tablePresent: tablePresent,
  dropTable: dropTable,
  dropAll: dropAll,
  addUser: addUser,
  deleteUser: deleteUser,
  showTableContent: showTableContent,
  addHistory: addHistory,
  clearHistory: clearHistory,
  deleteLastHistoryEntry: deleteLastHistoryEntry,
  getHistory: getHistory,
  getFaculties: getFaculties,
  getSubjects: getSubjects
}

function userPresent (id) {
  // noinspection SqlResolve
  return getUser(undefined, id).then(resolve => {
    if (resolve) {
      return 'true'
    }
    return 'false'
  })
}

function init_db () {
  tablePresent('user').then(() => {
    return Promise.resolve()
  }).catch(async () => {
    const createStatements = [
      data.createTableStatements.user,
      data.createTableStatements.history,
      data.createTableStatements.faculty,
      data.createTableStatements.studySubject
    ]
    for (let statement of createStatements) {
      await createTable(statement).catch(err => {
        console.error(err)
      })
    }
    return Promise.resolve()
  })
}

function updateUser (email, rzKennung) {
  let date = dateManager.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
  let statement
  let argument
  if (email) {
    statement = 'UPDATE user SET last_action = ? WHERE e_mail = ?'
    argument = email
  } else {
    statement = 'UPDATE user SET last_action = ? WHERE pk_user_id = ?'
    argument = rzKennung
  }
  return new Promise((resolve, reject) => {
    db.run(statement, [date, argument], err => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

/**
 *
 * @param email
 * @param rzKennung
 * @returns Promise if user present or undefined if not
 */
function getUser (email, rzKennung) {
  let sql
  let argument
  if (email) {
    sql = `SELECT *
           FROM user
           WHERE e_mail = ?`
    argument = email
  } else {
    sql = `SELECT *
           FROM user
           WHERE pk_user_id = ?`
    argument = rzKennung
  }
  return new Promise((resolve, reject) => {
    db.get(sql, [argument], (err, row) => {
      if (err) {
        reject()
        return
      }
      resolve(JSON.stringify(row))
    })
  })

}

function createTable (table) {
  return new Promise((resolve, reject) => {
    db.run(table, err => {
      if (err) {
        reject(err)
        return
      }
      resolve('creating table ok')
    })
  })
}

function tablePresent (tableName) {
  const statement = 'SELECT * FROM ' + tableName
  return new Promise((resolve, reject) => {
    db.run(statement, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve(true)
    })
  })
}

//works
function dropTable (table) {
  const statement = 'DROP TABLE ' + table
  return new Promise((resolve, reject) => {
    db.run(statement, err => {
      if (err) {
        reject(err)
        return
      }
      resolve('Success')
    })
  })
}

/**
 *
 * @returns {Promise<any[]>}
 */
function dropAll () {
  return Promise.all(Object.keys(data.createTableStatements).map(tableName => {
    // return another promise which always resolves to ensure that Promise all works with all tableNames!
    return new Promise(((re) => {
      dropTable(tableName).then(() => {
        re()
      }, reject => {
        re()
      })
    }))
  }))
}

// works
function addUser (pk_user_id, firstName, lastName, eMail) {
  return new Promise(((resolve, reject) => {
    // noinspection SqlResolve
    const statement = 'INSERT INTO user(pk_user_id, first_name, last_name, e_mail, last_action) VALUES (?,? ,? ,?, ?)'
    db.run(statement, [pk_user_id, firstName, lastName, eMail, dateManager.format(new Date(), 'YYYY-MM-DD HH:mm:ss')], (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  }))
}

//works
function deleteUser (pk_user_id) {
  return new Promise(((resolve, reject) => {
    // noinspection SqlResolve
    const statement = 'DELETE FROM user WHERE pk_user_id == ' + pk_user_id
    db.all(statement, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  }))
}

//works
function showTableContent (table) {
  // noinspection SqlResolve
  const statement = 'SELECT * FROM ' + table
  db.get(statement, (err, row) => {
    console.log(row)
  })
}

//todo server group raus
function addHistory (user_id, searched_rz_nr, name, e_mail, faculty, subject, server_group, gender) {
  return new Promise((resolve, reject) => {
    // noinspection SqlResolve
    const statement = 'INSERT INTO history(fk_user_id, searched_rz_nr, name, e_mail, faculty, subject, server_group, gender, date_entry) VALUES (?,?,?,?,?,?,?,?,?)'
    db.run(statement, [user_id, searched_rz_nr, name, e_mail, faculty, subject, server_group, gender, dateManager.format(new Date(), 'YYYY-MM-DD HH:mm:ss')], err => {
      if (err) {
        reject(err)
        return
      }
      resolve()
      //resolve()
    })
  })
}

function clearHistory () {
  // noinspection SqlResolve
  const statement = 'DELETE FROM history WHERE pk_history_id IS NOT NULL;'
  return new Promise((resolve, reject) => {
    db.run(statement, err => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

function deleteLastHistoryEntry () {
  // noinspection SqlResolve
  const statement = 'DELETE FROM history WHERE date_entry IN (SELECT date_entry FROM history ORDER BY date_entry ASC LIMIT 1)'
  return new Promise((resolve, reject) => {
    db.run(statement, err => {
      if (err) {
        console.log('Error: \n' + err)
        reject(err)
        return
      }
      resolve()
    })
  })
}

function getHistory (user_id) {
  return new Promise((resolve, reject) => {
    // noinspection SqlResolve
    const statement = 'SELECT * FROM history'
    db.all(statement, [], (err, rows) => {
      if (err) {
        reject(err)
        return
      }
      resolve(rows)
    })
  })
}

function getFaculties (ldapServer) {
  if (ldapServer === 'hsa') {
    return data.HSAFaculties()
  } else if (ldapServer === '?') {
    return '....'
  }
}

function getSubjects (ldapServer, faculty) {
  if (ldapServer === 'hsa') {
    return data.HSAStudies(faculty)
  } else if (ldapServer === '?') {
    return '....'
  }
}
