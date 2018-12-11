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
const fs = require('fs');
const sqlConnection = require('sqlite3').verbose();
const data = require('./data.js');
const path = require('path');
const dbPath = path.join(__dirname, 'db/halt.db');

//open database --> uses create/readwrite per default
let db;
getDbConnection().then(connection => {
  db = connection;
  init_db();
}).catch(err => {
  console.error(err);
});


function getDbConnection() {
  const targetPath = path.dirname(dbPath);
  if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath);
  return new Promise((resolve, reject) => {
    const con = new sqlConnection.Database(dbPath, (err) => {
      console.log(dbPath);
      if (err) {
        console.error('Error connecting to database');
        reject(err);
      } else {
        console.log('Connected to the chinook database.');
        resolve(con);
      }
    });
  });
}


//todo ggf
//const logger = require('../logging/logger.js')

exports.dbFunctions = {
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
  removeLastHistoryEntry: removeLastHistoryEntry,
  getHistory: getHistory,
  getFaculties: getFaculties,
  getSubjects: getSubjects
}

function userPresent(id) {
  // noinspection SqlResolve
  const statement = 'SELECT * FROM user WHERE pk_user_id == ' + id
  return new Promise((resolve, reject) => {
    db.all(statement, (err, row) => {
      if (err) {
        console.log('reject userPresent')
        reject(err)
        return
      }
      console.log('resolve userPresent')
      resolve(true)
    })
  })
}

function init_db() {
  tablePresent('user').then(() => {
    return Promise.resolve();
  }).catch(async () => {
    const createStatements = [
      data.createTableStatements.user,
      data.createTableStatements.history,
      data.createTableStatements.faculty,
      data.createTableStatements.studySubject
    ];
    console.info('creating tables...');
    for (let statement of createStatements) {
      await createTable(statement).catch(err => {
        console.error(err);
      })
    }
    return Promise.resolve();
  });
}

function updateUser(email, rzKennung) {
  let statement
  if (email) {
    statement = 'UPDATE user SET last_login = datetime(\'now\') WHERE e_mail = ' + email
  } else {
    statement = 'UPDATE user SET last_login = datetime(\'now\') WHERE pk_user_id = ' + rzKennung
  }
  return new Promise((resolve, reject) => {
    db.run(statement, err => {
      if (err) {
        console.log('Error in update user')
        reject(err)
        return
      }
      resolve()
    })
  })
}

function getUser(email, rzKennung) {
  console.log('get user')
  console.log(dbPath)
  let statement
  if (email) {
    statement = 'SELECT * FROM user WHERE e_mail = ' + email
  } else {
    statement = 'SELECT * FROM user WHERE pk_user_id = ' + rzKennung
  }
  return new Promise((resolve, reject) => {
    db.get(statement, (err, row) => {
      if (err) {
        console.log('reject')
        reject(err)
        return
      }
      resolve(row)
    })
  })

}

function createTable(table) {
  return new Promise((resolve, reject) => {
    db.run(table, err => {
      if (err) {
        console.log('error in create Table: ' + err)
        reject(err)
        return
      }
      console.log('Ok')
      resolve('creating table ok')
    })
  })
}

function tablePresent(tableName) {
  console.log('table present called')
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
function dropTable(table) {
  const statement = 'DROP TABLE ' + table
  return new Promise((resolve, reject) => {
    db.run(statement, err => {
      if (err) {
        console.log('Error dropping table:' + err)
        reject(err)
        return
      }
      console.log('Success dropping table')
      resolve('Success')
    })
  })
}

function dropAll() {
  return Promise.all(Object.keys(data.createTableStatements).map(tableName => {
    return new Promise(((re) => {
      dropTable(tableName).then(resolve => {
        re()
      }, reject => {
        re()
      })
    }))
  }))
}

// works
function addUser(pk_user_id, firstName, lastName, eMail) {
  return new Promise(((resolve, reject) => {
    // noinspection SqlResolve
    const statement = 'INSERT INTO user(pk_user_id, first_name, last_name, e_mail) VALUES (?, ?, ?, ?)'
    db.run(statement, [pk_user_id, firstName, lastName, eMail], (err) => {
      if (err) {
        console.log('Error adding new user: \n' + err)
        reject(err)
        return
      }
      resolve()
    })
  }))
}

//works
function deleteUser(pk_user_id) {
  return new Promise(((resolve, reject) => {
    // noinspection SqlResolve
    const statement = 'DELETE FROM user WHERE pk_user_id == ' + pk_user_id
    db.all(statement, (err) => {
      if (err) {
        console.log('Error deleting existing user: \n' + err)
        reject(err)
        return
      }
      resolve()
    })
  }))
}

//works
function showTableContent(table) {
  // noinspection SqlResolve
  const statement = 'SELECT * FROM ' + table
  db.get(statement, (err, row) => {
    console.log(row)
  })
}

function addHistory(user_id, searched_rz_nr, name, e_mail, faculty, subject, server_group, gender) {
  return new Promise((resolve, reject) => {
    // noinspection SqlResolve
    const statement = 'INSERT INTO history(fk_user_id, searched_rz_nr, name, e_mail, faculty, subject, server_group, gender) VALUES (?,? ,? ,?,?,?,?,?)'
    db.run(statement, [user_id, searched_rz_nr, name, e_mail, faculty, subject, server_group, gender], err => {
      if (err) {
        console.log('ERROR IS:')
        console.log(err)
        reject(err)
        return
      }
      resolve()
    })
  })
}

function clearHistory() {
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

function removeLastHistoryEntry() {
  // noinspection SqlResolve
  const statement = 'DELETE FROM history WHERE pk_history_id IN (SELECT pk_history_id FROM history ORDER BY pk_history_id ASC LIMIT 1)'
  return new Promise((resolve, reject) => {
    db.run(statement, err => {
      if (err) {
        console.log('ERROR')
        reject(err)
        return
      }
      resolve()
    })
  })
}

function getHistory(user_id) {
  return new Promise((resolve, reject) => {
    // noinspection SqlResolve
    const statement = 'SELECT * FROM history'
    db.all(statement, [], (err, rows) => {
      if (err) {
        console.log('reject')
        reject(err)
        return
      }
      console.log('resolve')
      resolve(JSON.stringify(rows))
    })
  })
}

function getFaculties(ldapServer) {
  if (ldapServer === 'hsa') {
    return data.HSAFaculties()
  } else if (ldapServer === '?') {
    return '....'
  }
}

function getSubjects(ldapServer, faculty) {
  if (ldapServer === 'hsa') {
    return data.HSAStudies(faculty)
  } else if (ldapServer === '?') {
    return '....'
  }
}
