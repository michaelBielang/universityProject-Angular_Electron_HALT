/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import logger from '../../logging/logger';
import * as ldapjs from 'ldapjs';

class LDAP {
  constructor() { }

  ldapOptions(srv?: string) {
    return {
      url: srv,
      timeout: 5000,
      connectTimeout: 10000,
      idleTimeout: 15000,
      orgUnit: 'ou=People,dc=fh-augsburg,dc=de'
    };
  }

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


  getLdapUserInfo(client: ldapjs.Client, user: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const filterPrefix = this.getLdapUserSearchType(user);
      if (filterPrefix) {
        const filterStr = filterPrefix + user + ')';
        const opts = {
          filter: filterStr,
          scope: 'sub'
        };
        client.search(this.ldapOptions()['orgUnit'], opts, (err, res) => {
          const entries = [];
          res.on('error', err => {
            reject(err);
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
      } else {
        reject({
          message: 'Given user has invalid syntax',
          status: 405
        });
      }
    });
  }


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
            logger.info('warn', 'LDAP server ' + srvNo + ' not reachable: ' + err['message']);
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
              logger.info('warn', 'LDAP server dns check timeout');
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
   * ldap is to slow for an or operation (filtering) with all four possibilities, so it needs to be predetermined...
   */
  getLdapUserSearchType(email) {
    // Test Regex: https://regex101.com/
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
    if (!this.isEmailAddress(email)) {
      return '(uid=';
    }
  }

  isEmailAddress(email) {
    const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return regex.test(email);
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

export default new LDAP();
