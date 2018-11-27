/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { NotificationService } from './notification.service';

@Injectable()
export class AuthService {
  private baseUrl;
  private apiUsersUrl;

  userObj;

  constructor(
    private http: Http,
    private readonly notificationService: NotificationService,
  ) {
    const port = (window.location.port === '4200') ? ':8787' : '';
    this.baseUrl = window.location.protocol + '//' + window.location.hostname + port;
    this.apiUsersUrl = this.baseUrl + '/api/users';

    // TODO: api testing
    setInterval(() => {
      this.getUserRequest('u0').subscribe(response => {
        this.notificationService.overrideTimeoutInMs(15000);
        this.notificationService.showNotification(
          'info',
          null,
          response.json()['message'],
        );
        this.notificationService.overrideTimeoutInMs(5000);
      }, error => {
        this.notificationService.overrideTimeoutInMs(15000);
        this.notificationService.showNotification(
          'error',
          null,
          error.json()['message'],
        );
        this.notificationService.overrideTimeoutInMs(5000);
      });
    }, 5000);
  }

  getUserRequest(userid) {
    return this.http.get(this.apiUsersUrl + '/' + userid, {
      headers: this.prepJsonHeaders(),
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

  prepJsonHeaders() {
    return new Headers({
      'Content-Type': 'application/json'
    });
  }
}
