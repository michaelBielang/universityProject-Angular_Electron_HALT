/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Component, AfterViewInit } from '@angular/core';
import { NotificationService } from './@core/services/notification.service';
import { ToasterService } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ],
})
export class AppComponent implements AfterViewInit {
  constructor(
    private readonly toasterService: ToasterService,
    private readonly notificationService: NotificationService,
  ) { }

  ngAfterViewInit() {
    const element = document.getElementById('global-load-spinner');
    element.parentNode.removeChild(element);
  }

  getNotificationConfig() {
    return this.notificationService.getConfig();
  }

  // it's never called, only purpose is to keep husky silent
  clearServices() {
    this.toasterService.clear();
  }
}
