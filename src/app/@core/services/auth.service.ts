/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import api from '../models/api-base-info.model';

@Injectable()
export class AuthService {
  userObj;

  constructor(
    private readonly http: Http,
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
    const body = {
      id: id,
      pw: pw
    }
    return this.http.post(api.auth, body, {
      headers: api.headers,
      withCredentials: true,
    });
  }

  getUserID() {
    return this.userObj['pk_user_id'];
  }

  setSession(user) {
    this.userObj = user;
  }
}
