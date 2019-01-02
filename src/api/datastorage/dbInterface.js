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
// const dateManager = require('date-and-time')
const moment = require('moment')
const dbPath = path.join(__dirname, 'db/halt.db')

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
  getAllHistoryEntries: getAllHistoryEntries,
  getFaculties: getFaculties,
  getSubjects: getSubjects
}

let db

/**
 * Init database connection
 * @returns {Promise<any>} with db connection or err
 */
function initDbCon (production) {
  return new Promise((resolve, reject) => {
    getDbConnection().then(connection => {
      db = connection
      if (production)
        return addDefaultTablesToDb
      else {
        resolve(db)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * Just relevant for initDB.
 * Handles different system paths (win/unix)
 * @returns {Promise<any>}
 */
function getDbConnection () {
  const targetPath = path.dirname(dbPath)
  if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath)
  return new Promise((resolve, reject) => {
    const con = new sqlConnection.Database(dbPath, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(con)
      }
    })
  })
}

/**
 * Adds default tables to the database if there is no user present
 * (case: app launched for the first time)
 */
function addDefaultTablesToDb () {
  tablePresent('user').then(async result => {
    if (!result) {
      const createStatements = [{
        name: 'user',
        statement: data.createTableStatements.user
      },
        {
          name: 'history',
          statement: data.createTableStatements.history
        },
        {
          name: 'faculty',
          statement: data.createTableStatements.faculty
        },
        {
          name: 'studySubject',
          statement: data.createTableStatements.studySubject
        }
      ]
      for (let statementObj of createStatements) {
        await testAndCreateSingleTable(statementObj).catch(err => {
          console.error(err)
        })
      }
    }
    return Promise.resolve()
  }).catch(err => {
    return Promise.reject(err)
  })
}

/**
 *
 * @param statementObj
 * @returns {Promise<any>}
 */
function testAndCreateSingleTable (statementObj) {
  return new Promise((resolve, reject) => {
    tablePresent(statementObj.name).then(result => {
      if (!result) {
        createTable(statementObj.statement).then(() => {
          resolve()
        }).catch(err => {
          reject(err)
        })
      }
      resolve()
    }).catch(err => {
      if (err)
        reject(err)
    })
  })
}

/**
 *
 * @param userID
 * @returns true / false
 */
function userPresent (userID) {
  // noinspection SqlResolve
  return getUser(undefined, userID).then(resolve => {
    return !!resolve
  })
}

/**
 *
 * @param email
 * @param rzKennung
 * @returns {Promise<any>}
 */
function updateUser (email, rzKennung) {
  let date = moment().format('YYYY-MM-DD HH:mm:ss')
  let statement
  let argument
  if (email) {
    // noinspection SqlResolve
    statement = `UPDATE user
                 SET last_action = ?
                 WHERE e_mail = ?`
    argument = email
  } else {
    // noinspection SqlResolve
    statement = `UPDATE user
                 SET last_action = ?
                 WHERE pk_user_id = ?`
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
    // noinspection SqlResolve
    sql = `SELECT *
           FROM user
           WHERE e_mail = ?`
    argument = email
  } else {
    // noinspection SqlResolve
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
      resolve(row)
    })
  })

}

/**
 * Creates particular table
 * @param table
 * @returns {Promise<any>}
 */
function createTable (table) {
  return new Promise((resolve, reject) => {
    db.run(table, err => {
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
 * @param tableName
 * @returns {Promise<any>} returns either true or false. Forced to resolve!
 */
function tablePresent (tableName) {
  const statement = 'SELECT * FROM ' + tableName
  return new Promise((resolve, reject) => {
    db.run(statement, (err) => {
      if (err) {
        resolve(false)
        return
      }
      resolve(true)
    })
  })
}

/**
 * drops a particular table
 * @param table
 * @returns {Promise<any>}
 */
function dropTable (table) {
  const statement = 'DROP TABLE ' + table
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

/**
 * drop all tables in the db
 * Implemented a nested promise by intention which always resolves to
 * ensure that Promise.all resolves even when a table was not present in the db.
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

/**
 * Add an User to the db
 * @param pk_user_id
 * @param firstName
 * @param lastName
 * @param eMail
 * @returns {Promise<any>}
 */
function addUser (pk_user_id, firstName, lastName, eMail) {
  if (eMail) {
    eMail = eMail.toLowerCase()
  }
  return new Promise(((resolve, reject) => {
    // noinspection SqlResolve
    const statement = `INSERT INTO user(pk_user_id, first_name, last_name, e_mail, last_action)
                       VALUES (?, ?, ?, ?, ?)`
    db.run(statement, [pk_user_id, firstName, lastName, eMail, moment().format('YYYY-MM-DD HH:mm:ss')], (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  }))
}

/**
 * Delets a particular user
 * @param pk_user_id
 * @returns {Promise<any>}
 */
function deleteUser (pk_user_id) {
  return new Promise(((resolve, reject) => {
    // noinspection SqlResolve
    const statement = `DELETE
                       FROM user
                       WHERE pk_user_id == ?`
    db.all(statement, [pk_user_id], (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  }))
}

/**
 * Was relevant for the first implementation step of this interface
 * @param table
 */
function showTableContent (table) {
  // noinspection SqlResolve
  const statement = `SELECT *
                     FROM ?`
  db.get(statement, [table], (err, row) => {
    console.log(row)
  })
}

/**
 * Adds a new history entry
 * @param user_id
 * @param id_input
 * @param name
 * @param e_mail
 * @param faculty
 * @param subject
 * @param gender
 * @returns {Promise<any>}
 */
function addHistory (user_id, id_input, name, e_mail, faculty, subject, gender) {
  return new Promise((resolve, reject) => {
    // noinspection SqlResolve
    const statement = `INSERT INTO history(fk_user_id, id_input, name, e_mail, faculty, subject,
                                           gender, date_entry)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    db.run(statement, [user_id, id_input, name, e_mail, faculty, subject, gender, moment().format('YYYY-MM-DD HH:mm:ss')], err => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

/**
 * Clears the history
 * @returns {Promise<any>}
 */
function clearHistory () {
  // noinspection SqlResolve
  const statement = `DELETE
                     FROM history
                     WHERE pk_history_id IS NOT NULL;`
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

/**
 * Deletes the last history entry.
 * Needed since our UI works FIFO principle to deliver the four last recent queries.
 * @returns {Promise<any>}
 */
function deleteLastHistoryEntry () {
  // noinspection SqlResolve
  const statement = `DELETE
                     FROM history
                     WHERE date_entry IN (SELECT date_entry FROM history ORDER BY date_entry ASC LIMIT 1)`
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

/**
 * Gets the last search history
 * @param user_id
 * @returns {Promise<any>}
 */
function getAllHistoryEntries (user_id) {
  return new Promise((resolve, reject) => {
    // noinspection SqlResolve
    const statement = `SELECT *
                       FROM history
                       WHERE fk_user_id = ?`
    db.all(statement, [user_id], (err, rows) => {
      if (err) {
        reject(err)
        return
      }
      resolve(rows)
    })
  })
}

/**
 * This function could be extended with other servers later
 * if necessary.
 * So far it only returns hsa faculties.
 * @param ldapServer
 * @returns {Promise<any>}
 */
function getFaculties (ldapServer) {
  if (ldapServer === 'hsa') {
    return new Promise((resolve, reject) => {
      const faculties = data.HSAFaculties()
      const facultyObjs = []
      for (const fac of faculties) {
        facultyObjs.push({
          faculty: fac,
          studySubjectObjs: data.HSAStudies(fac)
        })
      }
      resolve(facultyObjs)
    })
  } else if (ldapServer === '?') {
    return Promise.resolve([])
  }
}

/**
 * This function could be extended with other servers later
 * if necessary.
 * So far it only returns hsa subjects.
 * @param ldapServer
 * @param faculty
 * @returns {*}
 */
function getSubjects (ldapServer, faculty) {
  if (ldapServer === 'hsa') {
    return data.HSAStudies(faculty)
  } else if (ldapServer === '?') {
    return '....'
  }
}
