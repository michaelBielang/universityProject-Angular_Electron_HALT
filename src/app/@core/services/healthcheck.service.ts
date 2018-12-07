/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { NotificationService } from './notification.service';
import api from '../models/api-base-info.model';

@Injectable()
export class AuthService {
  constructor(
    private http: Http,
    private readonly notificationService: NotificationService,
  ) {
    setInterval(() => {
      this.healthcheckRequest().subscribe(() => {
      }, error => {
        console.error(error);
        this.notificationService.showNotification(
          'error',
          'API server is down',
          `Please restart the application...`,
        );
      });
    }, 5000);
  }

  healthcheckRequest() {
    return this.http.get(api.healthcheck, {
      headers: api.headers,
      withCredentials: true,
    });
  }
}
