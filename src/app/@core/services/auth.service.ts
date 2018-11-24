/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Injectable } from '@angular/core';


@Injectable()
export class AuthService {
  userObj;

  constructor() { }

  isLoggedIn() {
    return this.userObj != undefined;
  }

  authRequest(id, pw): Promise<any> {
    return new Promise((resolve, reject) => {
      if (id == undefined || id === '' || pw == undefined || pw === '') {
        reject('no id or pw was given');
      }
      if (id === 'test' && pw === 'test') {
        resolve({
          user: id,
          pw: pw,
        });
      }
      resolve(false);
    });
  }

  setSession(user) {
    this.userObj = user;
  }
}
