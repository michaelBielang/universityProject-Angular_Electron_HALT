/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../../logging/logger';
import * as ldapjs from 'ldapjs';
import ISearchObj from '../models/search-obj.model';

class LDAP {

  /**
   * Providing required options to establish the ldap connection
   * @param srv
   * @returns {}
   */
  ldapOptions(srv?: string) {
    return {
      url: srv,
      timeout: 5000,
      connectTimeout: 10000,
      idleTimeout: 15000,
      orgUnit: 'ou=People,dc=fh-augsburg,dc=de'
    };
  }

  /**
   * To prepare all required statements for each key value pair of search input
   * @param searchObj
   * @returns {Promise<any>}
   */
  ldapSearch(searchObj: ISearchObj): Promise<any> {
    return new Promise((resolve, reject) => {
      if (Object.keys(searchObj).length) {
        const ldapSearchObj = {};
        if (searchObj['id'] && searchObj['id'].length) {
          ldapSearchObj['uid'] = this.getLdapRzIdType() + '*' + searchObj['id'].trim().toLowerCase() + '*)';
        }

        if (searchObj['name'] && searchObj['name'].length) {
          ldapSearchObj['firstnames'] = [];
          ldapSearchObj['lastnames'] = [];
          const names = searchObj['name'].trim().replace(',', ' ').replace('.', ' ').split(' ');
          for (let name of names) {
            name = name.trim().toLowerCase();
            const fn = this.getLdapFirstNameType() + '*' + name + '*)';
            const ln = this.getLdapLastNameType() + '*' + name + '*)';
            ldapSearchObj['firstnames'].push(fn);
            ldapSearchObj['lastnames'].push(ln);
          }
        }

        if (searchObj['faculty'] && searchObj['faculty'].length) {
          ldapSearchObj['faculty'] = this.getLdapFacultyType() + '*' + searchObj['faculty'].trim().toLowerCase() + '*)';
        }

        if (searchObj['subjectordegree'] && searchObj['subjectordegree'].length) {
          const sub = searchObj['subjectordegree'].trim().replace('(', '').replace(')', '').split(' ').join('*');
          ldapSearchObj['subject'] = this.getLdapStudySubjectType() + '*' + sub.toLowerCase() + '*)';
        }

        if (searchObj['gender']) {
          let gen: number = parseInt(searchObj['gender']);
          if (isNaN(gen)) {
            gen = searchObj['gender'].indexOf('f') !== -1 ? 2 : 1;
          }
          ldapSearchObj['gender'] = this.getLdapGenderType() + gen + ')';
        }

        if (searchObj['email'] && searchObj['email'].length && this.isEmailAddress(searchObj['email'])) {
          let mailPrefix = searchObj['email'].trim().split('@')[0];
          let mailParts = [];
          if (mailPrefix.indexOf('.') !== 1 || mailPrefix.indexOf(' ') !== 1) {
            mailParts = mailPrefix.replace(' ', '.').split('.');
          } else {
            mailParts.push(mailPrefix);
          }
          ldapSearchObj['email'] = this.getLdapEmailType(searchObj['email']) + '*' + mailParts.join('*') + '*)';
        }

        this.getLdapClient().then(async client => {
          const keys = Object.keys(ldapSearchObj);
          const ldapResults = [];
          for (const key of keys) {
            // don't explicitly search for gender alone, it will try to get gender if it's available in makeLdapFilterString
            if (key !== 'gender') {
              const type: string = toString.call(ldapSearchObj[key]);
              if (type === "[object Array]") {
                for (const entry of ldapSearchObj[key]) {
                  await this.sortInLdapResults(client, ldapResults, key, ldapSearchObj, entry);
                }
              } else {
                await this.sortInLdapResults(client, ldapResults, key, ldapSearchObj);
              }
            }
          }
          resolve(ldapResults);
        }).catch(err => {
          reject(err);
        });
      } else {
        reject(new Error('No search params provided'));
      }
    });
  }

  /**
   * To interface the search and concatenation of search key value pairs
   * @param client
   * @param ldapResults
   * @param searchKey
   * @param searchObj
   * @param searchSubEntry
   * @returns {Promise<any>}
   */
  private sortInLdapResults(client: ldapjs.Client, ldapResults: any[], searchKey: string, searchObj: any, searchSubEntry?: string): Promise<any> {
    return new Promise(resolve => {
      this.execLdapSearch(client, this.makeLdapFilterString(searchSubEntry || searchObj[searchKey], searchObj['gender'])).then(results => {
        for (const res of results['data']) {
          if (!this.ldapObjArrContains(ldapResults, 'uid', res)) {
            ldapResults.push(res);
          }
        }
        resolve();
      }).catch(err => {
        logger.error(err);
        resolve();
      });
    });
  }

  /**
   * To get info if given user id and pw can be authenticated against the HS LDAP
   * @param client
   * @param user
   * @param pass
   * @returns {Promise<any>}
   */
  auth(client: ldapjs.Client, user: string, pass: string): Promise<any> {
    user = user.toLowerCase();
    return new Promise((resolve, reject) => {
      if (client) {
        client.bind('uid=' + user + ',' + this.ldapOptions()['orgUnit'], pass, err => {
          if (err) {
            reject({
              message: 'Authentication failed',
              status: 401
            });
          } else {
            resolve({
              message: 'Authenticated',
              userid: user
            });
          }
        });
      } else {
        reject({
          message: 'LDAP client unavailable',
          status: 404
        });
      }
    });
  }

  /**
   * To get info if given user id and pw can be authenticated against the HS LDAP
   * @param client
   * @param user
   * @param pass
   * @returns {Promise<any>}
   */
  getLdapUserInfo(client: ldapjs.Client, user: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const filterPrefix = this.getLdapUserSearchType(user);
      if (filterPrefix) {
        const filterStr = filterPrefix + user + ')';
        this.execLdapSearch(client, filterStr).then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      } else {
        reject({
          message: 'Given user has invalid syntax',
          status: 405
        });
      }
    });
  }

  /**
   * Actually perform search on LDAP with given key value pair
   * @param client
   * @param filter
   * @returns {Promise<any>}
   */
  execLdapSearch(client: ldapjs.Client, filter): Promise<any> {
    return new Promise((resolve, reject) => {
      const opts = {
        filter: filter,
        scope: 'sub'
      };
      client.search(this.ldapOptions()['orgUnit'], opts, (err, res) => {
        if (err) {
          reject(err);
        }
        const entries = [];
        res.on('error', searchErr => {
          reject(searchErr);
        });
        res.on('searchEntry', entry => {
          entries.push(entry.object);
        });
        res.on('end', result => {
          resolve({
            status: result.status,
            entries: entries.length,
            data: entries
          });
        });
      });
    });
  }

  /**
   * To establish a connection to the HS LDAP or giving info if it's unreachable
   * @returns {Promise<any>}
   */
  getLdapClient(): Promise<ldapjs.Client> {
    return new Promise((resolve, reject) => {
      let conCount = 0;
      let foundCon = false;

      const srvNumbs: number[] = this.shuffle([1, 2]);
      srvNumbs.map((srvNo) => {
        const options = this.ldapOptions('ldap://ldap' + srvNo + '.fh-augsburg.de');
        const client = ldapjs.createClient(options);
        client.on('error', err => {
          if (err) {
            logger.info('LDAP server ' + srvNo + ' not reachable: ' + err['message']);
            conCount += 1;
          }
        });

        client.on('connect', () => {
          foundCon = true;
          resolve(client);
        });
      });

      setTimeout(() => {
        if (conCount === srvNumbs.length) {
          reject({
            message: 'No LDAP server reachable',
            status: 401
          });
        } else {
          setTimeout(() => {
            if (!foundCon) {
              logger.info('LDAP server dns check timeout');
              reject({
                message: 'LDAP server dns check timeout',
                status: 401
              });
            }
          }, this.ldapOptions().timeout);
        }
      }, 1000);
    });
  }

  /**
   * Which type of id should be looked at
   * @param email
   * @returns string
   */
  private getLdapUserSearchType(email) {
    if (!this.isEmailAddress(email)) {
      return this.getLdapRzIdType();
    } else {
      return this.getLdapEmailType(email);
    }
  }

  /**
   * Prepared prefix for given type
   * @returns string
   */
  private getLdapRzIdType() {
    return '(uid=';
  }

  /**
   * Prepared prefix for given type
   * @returns string
   */
  private getLdapFirstNameType() {
    return '(givenName=';
  }

  /**
   * Prepared prefix for given type
   * @returns string
   */
  private getLdapLastNameType() {
    return '(sn=';
  }

  /**
   * Prepared prefix for given type
   * @returns string
   */
  private getLdapFacultyType() {
    return '(ou=';
  }

  /**
   * Prepared prefix for given type
   * @returns string
   */
  private getLdapStudySubjectType() {
    return '(dfnEduPersonFieldOfStudyString=';
  }

  /**
   * Prepared prefix for given type
   * @returns string
   */
  private getLdapGenderType() {
    return '(schacGender=';
  }


  /**
   * ldap is to slow for an or operation (filtering) with all four possibilities, it needs to be predetermined...
   * @param email
   * @returns string
   */
  private getLdapEmailType(email) {
    // Test Regex: https://regex101.com/
    email = email.toLowerCase();
    const rp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+/;
    const hsmail = new RegExp(rp.source + '\\.' + rp.source + '@hs-augsburg\\.de');
    if (hsmail.test(email)) {
      return '(mail=';
    }
    const rzmail = new RegExp(rp.source + '(?:\\.' + rp.source + ')*@+(?:rz\\.)*fh-augsburg\\.de');
    if (rzmail.test(email)) {
      return '(mailLocalAddress=';
    }
    const edumail = new RegExp(rp.source + '@hs-augsburg\\.de');
    if (edumail.test(email)) {
      return '(eduPersonPrincipalName=';
    }
    return '(mailRoutingAddress=';
  }

  /**
   * to concatenate filter string for ldap search
   * @param filter
   * @param gender
   * @returns string
   */
  private makeLdapFilterString(filter: string, gender?: string): string {
    const filterStr = gender ? '(&' + gender + filter + ')' : filter;
    return filterStr;
  }

  /**
   * comparison helper function
   * @param arr
   * @param arrKey
   * @param compareValue
   * @returns boolean
   */
  private ldapObjArrContains(arr: any[], arrKey: string, compareValue: any): boolean {
    let contains = false;
    for (const e of arr) {
      if (e[arrKey] === compareValue) {
        contains = true;
        break;
      }
    }
    return contains;
  }

  /**
   * regex helper function to test if input is of type email
   * @param email
   * @returns boolean
   */
  isEmailAddress(email) {
    email = email.toLowerCase();
    // @ts-ignore
    const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return regex.test(email);
  }

  /**
   * helper function, mainly used to randomize selected ldap server and don't overuse a single one
   * @param a
   * @returns generic depends on input
   */
  private shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

export default new LDAP();
