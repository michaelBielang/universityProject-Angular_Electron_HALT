/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import api from '../models/api-base-info.model';

@Injectable()
export class AuthService {
  userObj;

  constructor(
    private http: Http,
  ) {}

  getUserRequest(userid) {
    return this.http.get(api.users + '/' + userid, {
      headers: api.headers,
      withCredentials: true,
    });
  }

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
