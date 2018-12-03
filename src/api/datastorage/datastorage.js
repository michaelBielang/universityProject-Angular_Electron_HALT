/**
 * Created by Michael Bielang on 27.11.2018.
 * www.codemerger.com
 * bielang@codemerger.com
 *
 * Project:
 * java version "10.0.1"
 */

'use strict'
const createTableStatements = {
  studySubject: 'CREATE TABLE study_subject(pk_study_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, study_name VARCHAR(255) NOT NULL, FOREIGN KEY (fK_faculty_name) REFERENCES faculty(pk_faculty_name))',
  user: 'CREATE TABLE user(pk_user_id INTEGER PRIMARY KEY NOT NULL, first_name VARCHAR(255), last_name VARCHAR(255), e_mail VARCHAR(255))',
  history: 'CREATE TABLE history(pk_history_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, FOREIGN KEY (fk_user_id) REFERENCES user(pk_user_id), id_input INTEGER, name VARCHAR(255), e_mail VARCHAR(255), faculty VARCHAR(255), subject VARCHAR(255), server_group VARCHAR(255), gender VARCHAR(255))',
  faculty: 'CREATE TABLE faculty(pk_faculty_id INTEGER PRIMARY KEY , faculty_name VARCHAR(255), university_name VARCHAR(255))',
  LDAP_ServerGroup: 'CREATE TABLE ldap(pk_server_group_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, server_group_name VARCHAR(255) NOT NULL, people VARCHAR(255) NOT NULL, dc VARCHAR(255) NOT NULL, lang VARCHAR(255) NOT NULL, group_priority INTEGER NOT NULL)',
  VPN_ServerConfig: 'CREATE TABLE vpn_server_config(server_config_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, FOREIGN KEY (fk_group_id) REFERENCES ldap(pk_server_group_id), config_file VARCHAR(255) NOT NULL, url VARCHAR(255) NOT NULL, port INTEGEREGER NOT NULL, cert VARCHAR(255) NOT NULL , ca VARCHAR(255) NOT NULL )'
}

/** @noinspection SqlResolve */
const sqlConnection = require('sqlite3').verbose()

//open database --> uses create/readwrite per default
let db = new sqlConnection.Database('./db/halt.db', (err) => {
  if (err) {
    console.error('Error connecting to database')
  }
  console.log('Connected to the chinook database.')
})

function init_db () {

  if (!tablePresent('user')) {
    createTable(createTableStatements.user)
      .then(resolve => {
        createTable(createTableStatements.history)
      }).then(resolve => {
      createTable(createTableStatements.faculty)
    }).then(resolve => {
      createTable(createTableStatements.studySubject)
    }).catch(reject => {
      console.log('Error init DB')
    })
  }
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

function tablePresent (tableName) {
  console.log('table present called')
  const statement = 'SELECT * FROM ' + tableName
  return new Promise((resolve, reject) => {
    db.run(statement, (err) => {
      if (err) {
        reject(false)
        return
      }
      resolve(true)
    })
  })
}

// works
// TODO fragen wie man das hier mit return true/false ohne promise lösen kann
function userPresent (id) {
  // noinspection SqlResolve
  const statement = 'SELECT * FROM user WHERE pk_user_id == ' + id
  return new Promise((resolve, reject) => {
    db.all(statement, (err, row) => {
      if (err) {
        reject(false)
        return
      }
      resolve(true)
    })
  })
}

//works
function dropTable (table) {
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
  return Promise.all(Object.keys(createTableStatements).map(tableName => {
    return new Promise((resolve) => {
      dropTable(tableName)
        .then(resolve => {
          console.log('reached resolved')
        }, onReject => {
          console.log('reject part')
        })
    })
  }))
}

// works
function addUser (pk_user_id, firstName, lastName, eMail) {
  return new Promise(((resolve, reject) => {
    // noinspection SqlResolve
    const statement = 'INSERT INTO user(pk_user_id, first_name, last_name, e_mail) VALUES (?,? ,? ,?)'
    db.run(statement, [pk_user_id, firstName, lastName, eMail], (err) => {
      if (err) {
        console.log('Error adding new user: \n' + err)
        reject()
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
        console.log('Error deleting existing user: \n' + err)
        reject('Error deleting existing user: \n' + err)
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

function addHistory (user_id, id_input, name, e_mail, faculty, subject, server_group, gender) {
  return new Promise((resolve, reject) => {
      // noinspection SqlResolve
      const statement = 'INSERT INTO history(pk_user_id, id_input, name, e_mail, faculty, subject, server_group, gender) VALUES (?,? ,? ,?,?,?,?,?)'
      db.run(statement, [user_id, id_input, name, e_mail, faculty, subject, server_group, gender], err => {
        if (err) {
          reject()
          return
        }
        resolve()
      })
    }
  )
}

function clearHistory () {
  // noinspection SqlResolve
  const statement = 'DELETE FROM history WHERE pk_history_id IS NOT NULL;'
  return new Promise((resolve, reject) => {
    db.run(statement, err => {
      if (err) {
        reject()
        return
      }
      resolve()
    })
  })
}

function removeLastHistoryEntry () {
  // noinspection SqlResolve
  const statement = 'DELETE FROM history WHERE pk_history_id IN (SELECT pk_history_id FROM history ORDER BY pk_history_id ASC LIMIT 1)'
  return new Promise((resolve, reject) => {
    db.run(statement, err => {
      if (err) {
        reject()
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
        reject()
        return
      }
      resolve(JSON.stringify(rows))
    })
  })
}

function getFaculties (ldapServer) {

}

function getSubjects (ldapServer, faculty) {

}

//addUser(1, 'firstName', 'lastName', 'email')
console.log(userPresent(1).then(resolve => console.log(resolve)))

/*createTable(createTableStatements.user).then(resolve => {
  console.log('table already present')
  return addUser(1, 'firstName', 'lastName', 'email')
}, reject => {
  console.log('table not present')
  return addUser(1, 'firstName', 'lastName', 'email')
}).then(resolve => {
    console.log('user was not added')
  }, reject => {
    console.log('user was present and gets deleted')
    console.log('should be true: ' + userPresent(1))
    return deleteUser(1)
  }
).then(resolve => {
  console.log('should be false: ' + userPresent(1))
  console.log('User got deleted')
}, reject => {
  console.log('reject')
})*/
