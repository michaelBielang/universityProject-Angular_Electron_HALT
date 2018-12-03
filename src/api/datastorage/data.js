// noinspection SqlResolve
/**
 * Created by Michael Bielang on 03.12.2018.
 * www.codemerger.com
 * bielang@codemerger.com
 *
 * Project:
 * java version "10.0.1"
 */

exports.createTableStatements = {

  studySubject: 'CREATE TABLE study_subject(pk_study_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, study_name VARCHAR(255) NOT NULL, FOREIGN KEY (fK_faculty_name) REFERENCES faculty(pk_faculty_name))',
  user: 'CREATE TABLE user(pk_user_id INTEGER PRIMARY KEY NOT NULL, first_name VARCHAR(255), last_name VARCHAR(255), e_mail VARCHAR(255))',
  history: 'CREATE TABLE history(pk_history_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, FOREIGN KEY (fk_user_id) REFERENCES user(pk_user_id), id_input INTEGER, name VARCHAR(255), e_mail VARCHAR(255), faculty VARCHAR(255), subject VARCHAR(255), server_group VARCHAR(255), gender VARCHAR(255))',
  faculty: 'CREATE TABLE faculty(pk_faculty_id INTEGER PRIMARY KEY , faculty_name VARCHAR(255), university_name VARCHAR(255))',
  LDAP_ServerGroup: 'CREATE TABLE ldap(pk_server_group_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, server_group_name VARCHAR(255) NOT NULL, people VARCHAR(255) NOT NULL, dc VARCHAR(255) NOT NULL, lang VARCHAR(255) NOT NULL, group_priority INTEGER NOT NULL)',
  VPN_ServerConfig: 'CREATE TABLE vpn_server_config(server_config_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, FOREIGN KEY (fk_group_id) REFERENCES ldap(pk_server_group_id), config_file VARCHAR(255) NOT NULL, url VARCHAR(255) NOT NULL, port INTEGEREGER NOT NULL, cert VARCHAR(255) NOT NULL , ca VARCHAR(255) NOT NULL )'
}

exports.HSAStudies = function (faculty) {
  if (faculty === 'Informatik') {
    return 'Informatik (Bachelor),Interaktive Medien (Bachelor),Mechatronik (Bachelor),Systems Engineering (Bachelor),Technische Informatik (Bachelor),Wirtschaftsinformatik (Bachelor),Applied Research (Master),Business Information Systems (Master),Industrielle Sicherherit (Master),Informatk (Master),Interaktive Mediensysteme (Master),IT-Projekt- und Prozessmanagement (Master)'.split(',')
  } else if (faculty === 'Wirtschaft') {
    return 'Betriebswirtschaft (Bachelor),International Management (Bachelor),Internationales Wirtschaftsingenieurwesen (Bachelor),International Business and Finance (Master),Marketing/Vertrieb/Medien (Master),Personalmanagement (Master),Steuern und Rechnungslegung (Master),Industrielle Sicherheit (Master)'.split(',')
  } else if (faculty === 'Gestaltung') {
    return 'Kommunikationsdesign (Bachelor),Interaktive Medien (Bachelor),Interatiktive Mediensysteme (Master),Design- und Kommunikationsstrategie (Master)'.split(',')
  } else if (faculty === 'Angewandte Geistes und Naturwissenschaften') {
    return ['Soziale Arbeit (Bachelor)']
  } else if (faculty === 'Architektur und Bauwesen') {
    return 'Architektur (Bachelor),Energieeffizientes Plan und Bauen (Bachelor),Bauingenieurwesen (Bachelor),Architektur (Master),Allgemeiner Ingenieurbau (Master),Energie Effizienz Design - E2D (Master)'.split(',')
  } else if (faculty === 'Elektrotechnik') {
    return 'Elektrotechnik (Bachelor),Internationales Writschaftsingenieurwesen (Bachelor),Mechatronik (Bachelor),Technische Informatik (Bachelor),Applied Research (Master),Industrielle Sicherheit (Master),Mechatronic Systems (Master)'.split(',')
  } else if (faculty === 'Maschinenbau und Verfahrenstechnik') {
    return 'Maschinenbau (Bachelor),Umwelt- und Verfahrenstechnik (Bachelor),Leichtbau- und Faserverbundtechnologie (Master),Umwelt- und Verfahrenstechnik (Master)'.split(',')
  }
}

exports.HSAFaculties = function () {
  return 'Informatik,Wirtschaft,Gestaltung,Angewandte Geistes und Naturwissenschaften,Architektur und Bauwesen,Elektrotechnik,Maschinenbau und Verfahrenstechnik'.split(',')
}
