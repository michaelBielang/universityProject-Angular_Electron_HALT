/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

// import logger from '../../logging/logger';
// import * as os from 'os';
// import * as path from 'path';
// import * as fs from 'fs';
// import { exec } from 'sudo-prompt';

// TODO: look for possible and fitting ldap modules:
// 1. https://www.npmjs.com/package/ldapjs-client
// 2. https://www.npmjs.com/package/ldapjs
// import * as ldapjs from "ldapjs";

class LDAP {
  constructor() { }


  /**
   * Prepares options object for ldap connection/dns check
   *
   */
  ldapOptions(srv?: string) {
    return {
      url: srv,
      timeout: 5000,
      connectTimeout: 10000,
      idleTimeout: 15000
    };
  }

  /**
   * first prototype for ldap prefiltering
   *
   * ldap is to slow for an or operation (filtering) with all four possibilities, so it needs to be predetermined...
   *
   */
  // getLdapSearchType(email) {
  //   // Test Regex: https://regex101.com/
  //   const rp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+/;
  //   const hsmail = new RegExp(rp.source + "\\." + rp.source + "@hs-augsburg\\.de");
  //   if (hsmail.test(email)) {
  //     return "(mail=";
  //   }
  //   const rzmail = new RegExp(rp.source + "(?:\\." + rp.source + ")*@+(?:rz\\.)*fh-augsburg\\.de");
  //   if (rzmail.test(email)) {
  //     return "(mailLocalAddress=";
  //   }
  //   const edumail = new RegExp(rp.source + "@hs-augsburg\\.de");
  //   if (edumail.test(email)) {
  //     return "(eduPersonPrincipalName=";
  //   }
  //   if (!this.isEmailAddress(email)) {
  //     return "(uid=";
  //   }
  // }

  isEmailAddress(email) {
    const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return regex.test(email);
  }
}

export default new LDAP();
