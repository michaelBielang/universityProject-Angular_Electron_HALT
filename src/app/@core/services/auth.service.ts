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
  ) { }

  getUserRequest(userid) {
    return this.http.get(api.users + '/' + userid, {
      headers: api.headers,
      withCredentials: true,
    });
  }

  isLoggedIn() {
    return this.userObj != undefined;
  }

  authRequest(id, pw) {
    const req = {
      id: id,
      pw: pw
    }
    return this.http.post(api.auth, req, {
      headers: api.headers,
      withCredentials: true,
    });
  }

  setSession(user) {
    this.userObj = user;
  }
}
