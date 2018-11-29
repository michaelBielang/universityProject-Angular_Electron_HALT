// noinspection SqlResolve
/**
 * Created by Michael Bielang on 27.11.2018.
 * www.codemerger.com
 * bielang@codemerger.com
 *
 * Project:
 * java version "10.0.1"
 */

export const createTables = {
  studySubject: 'CREATE TABLE study_subject(pk_study_id INT PRIMARY KEY AUTOINCREMENT NOT NULL, study_name VARCHAR(255) NOT NULL, FOREIGN KEY (fK_faculty_name) REFERENCES faculty(pk_faculty_name))',
  user: 'CREATE TABLE user(pk_user_id INT PRIMARY KEY AUTOINCREMENT NOT NULL, first_name VARCHAR(255), last_name VARCHAR(255), e_mail VARCHAR(255), last_login DATE)',
  history: 'CREATE TABLE history(pk_history_id INT PRIMARY KEY AUTOINCREMENT NOT NULL, FOREIGN KEY (fk_user_id) REFERENCES user(pk_user_id), id_input INT, name VARCHAR(255), e_mail VARCHAR(255), faculty VARCHAR(255), subject VARCHAR(255), server_group VARCHAR(255), gender VARCHAR(255))',
  faculty: 'CREATE TABLE faculty(pk_faculty_id INT PRIMARY KEY , faculty_name VARCHAR(255), university_name VARCHAR(255))',
  LDAP_ServerGroup: 'CREATE TABLE ldap(pk_server_group_id INT PRIMARY KEY AUTOINCREMENT NOT NULL, server_group_name VARCHAR(255) NOT NULL, people VARCHAR(255) NOT NULL, dc VARCHAR(255) NOT NULL, lang VARCHAR(255) NOT NULL, group_priority INT NOT NULL)',
  VPN_ServerConfig: 'CREATE TABLE vpn_server_config(server_config_id INT PRIMARY KEY AUTOINCREMENT NOT NULL, FOREIGN KEY (fk_group_id) REFERENCES ldap(pk_server_group_id), config_file VARCHAR(255) NOT NULL, url VARCHAR(255) NOT NULL, port INTEGER NOT NULL, cert VARCHAR(255) NOT NULL , ca VARCHAR(255) NOT NULL )'
}


