/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Component, AfterViewInit } from '@angular/core';
import { DetailsService } from '../../@core/services/details.service';
import { NotificationService } from '../../@core/services/notification.service';
import * as Clipboard from 'clipboard';

@Component({
  selector: 'app-details',
  styleUrls: ['./details.component.scss'],
  templateUrl: './details.component.html',
})
export class DetailsComponent implements AfterViewInit {
  objClipboard = {};

  constructor(
    public readonly detailsService: DetailsService,
    private readonly notificationService: NotificationService,
  ) { }

  ngAfterViewInit() {
    this.registerClipboardEvents();
  }

  registerClipboardEvents() {
    this.objClipboard['gender'] = new Clipboard('.gender-info', {
      text: trigger => { return trigger.innerHTML.trim() },
    });
    this.objClipboard['gender'].on('success', (e) => success(e, this.notificationService));
    this.objClipboard['gender'].on('error', (e) => fail(e, this.notificationService));

    this.objClipboard['firstname'] = new Clipboard('.firstname-info', {
      text: trigger => { return trigger.innerHTML.trim() },
    });
    this.objClipboard['firstname'].on('success', (e) => success(e, this.notificationService));
    this.objClipboard['firstname'].on('error', (e) => fail(e, this.notificationService));

    this.objClipboard['lastname'] = new Clipboard('.lastname-info', {
      text: trigger => { return trigger.innerHTML.trim() },
    });
    this.objClipboard['lastname'].on('success', (e) => success(e, this.notificationService));
    this.objClipboard['lastname'].on('error', (e) => fail(e, this.notificationService));

    const emails = this.detailsService.detailsObj['emails'];
    for (let i = 0; i < emails.length; ++i) {
      this.objClipboard['email' + i] = new Clipboard('.email-info' + i, {
        text: trigger => { return trigger.innerHTML.trim() },
      });
      this.objClipboard['email' + i].on('success', (e) => success(e, this.notificationService));
      this.objClipboard['email' + i].on('error', (e) => fail(e, this.notificationService));
    }

    this.objClipboard['studysubject'] = new Clipboard('.studysubject-info', {
      text: trigger => { return trigger.innerHTML.trim() },
    });
    this.objClipboard['studysubject'].on('success', (e) => success(e, this.notificationService));
    this.objClipboard['studysubject'].on('error', (e) => fail(e, this.notificationService));

    this.objClipboard['faculty'] = new Clipboard('.faculty-info', {
      text: trigger => { return trigger.innerHTML.trim() },
    });
    this.objClipboard['faculty'].on('success', (e) => success(e, this.notificationService));
    this.objClipboard['faculty'].on('error', (e) => fail(e, this.notificationService));

    this.objClipboard['degree'] = new Clipboard('.degree-info', {
      text: trigger => { return trigger.innerHTML.trim() },
    });
    this.objClipboard['degree'].on('success', (e) => success(e, this.notificationService));
    this.objClipboard['degree'].on('error', (e) => fail(e, this.notificationService));

    this.objClipboard['university'] = new Clipboard('.university-info', {
      text: trigger => { return trigger.innerHTML.trim() },
    });
    this.objClipboard['university'].on('success', (e) => success(e, this.notificationService));
    this.objClipboard['university'].on('error', (e) => fail(e, this.notificationService));

    this.objClipboard['identity'] = new Clipboard('.identity-info', {
      text: trigger => { return trigger.innerHTML.trim() },
    });
    this.objClipboard['identity'].on('success', (e) => success(e, this.notificationService));
    this.objClipboard['identity'].on('error', (e) => fail(e, this.notificationService));

    function success(e, note) {
      note.showNotification(
        'success',
        null,
        'Copied to clipboard',
      );
      e.clearSelection();
    }
    function fail(e, note) {
      note.showNotification(
        'error',
        null,
        'Clipboard copy failed',
      );
      e.clearSelection();
    }
  }

  ngOnDestroy() {
    Object.keys(this.objClipboard).forEach(key => {
      if (this.objClipboard[key]) this.objClipboard[key].destroy();
    });
  }
}
