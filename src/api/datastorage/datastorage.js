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
  studySubject: 'CREATE TABLE study_subject(pk_study_id INT PRIMARY KEY AUTOINCREMENT NOT NULL, study_name VARCHAR(255) NOT NULL, FOREIGN KEY (fK_faculty_name) REFERENCES faculty(pk_faculty_name))',
  user: 'CREATE TABLE user(pk_user_id INT PRIMARY KEY AUTOINCREMENT NOT NULL, first_name VARCHAR(255), last_name VARCHAR(255), e_mail VARCHAR(255), last_login DATE)',
  history: 'CREATE TABLE history(pk_history_id INT PRIMARY KEY AUTOINCREMENT NOT NULL, FOREIGN KEY (fk_user_id) REFERENCES user(pk_user_id), id_input INT, name VARCHAR(255), e_mail VARCHAR(255), faculty VARCHAR(255), subject VARCHAR(255), server_group VARCHAR(255), gender VARCHAR(255))',
  faculty: 'CREATE TABLE faculty(pk_faculty_id INT PRIMARY KEY , faculty_name VARCHAR(255), university_name VARCHAR(255))',
  LDAP_ServerGroup: 'CREATE TABLE ldap(pk_server_group_id INT PRIMARY KEY AUTOINCREMENT NOT NULL, server_group_name VARCHAR(255) NOT NULL, people VARCHAR(255) NOT NULL, dc VARCHAR(255) NOT NULL, lang VARCHAR(255) NOT NULL, group_priority INT NOT NULL)',
  VPN_ServerConfig: 'CREATE TABLE vpn_server_config(server_config_id INT PRIMARY KEY AUTOINCREMENT NOT NULL, FOREIGN KEY (fk_group_id) REFERENCES ldap(pk_server_group_id), config_file VARCHAR(255) NOT NULL, url VARCHAR(255) NOT NULL, port INTEGER NOT NULL, cert VARCHAR(255) NOT NULL , ca VARCHAR(255) NOT NULL )'
}

/** @noinspection SqlResolve */
const sqlConnection = require('sqlite3').verbose()

//open database --> uses create/readwrite per default
let db = new sqlConnection.Database('test.db', (err) => {
  if (err) {
    console.error('Error connecting to database')
  }
  console.log('Connected to the chinook database.')
})

function init_db () {
  let ok = true
  if (!tablePresent('user')) {
    createTable(createTableStatements.user)
      .then(resolve => {
        createTable(createTableStatements.history)
      }).then(resolve => {
      createTable(createTableStatements.LDAP_ServerGroup)
    }).then(resolve => {
      createTable(createTableStatements.studySubject)
    }).then(resolve => {
      createTable(createTableStatements.VPN_ServerConfig)
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
  const statement = 'SELECT * FROM ' + table_name
  let returnValue = true
  db.run(statement, (err) => {
    if (err) {
      returnValue = false
      console.log('Error')
    }
  })
  return returnValue
}

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
      dropTableFunc(tableName)
        .then(resolve => {
          console.log('reached resolved')
        }, onReject => {
          console.log('reject part')
        })
    })
  }))
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
