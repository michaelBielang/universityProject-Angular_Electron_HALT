/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import {AfterViewInit, Component, Input, OnDestroy} from '@angular/core';
import {TabSelectionService} from '../../../@core/services/tab-selection.service';
import {DetailsService} from '../../../@core/services/details.service';
import {NotificationService} from '../../../@core/services/notification.service';
import * as Clipboard from 'clipboard';
import route from '../../../@core/enums/route.enum';

@Component({
  selector: 'app-result-entry',
  styleUrls: ['./result-entry.component.scss'],
  templateUrl: './result-entry.component.html',
})
export class ResultEntryComponent implements AfterViewInit, OnDestroy {
  @Input() userData;
  @Input() userIndex;
  selectDetailsTimeout: any;
  emailClipboard;

  constructor(
    private readonly tabSelectionService: TabSelectionService,
    private readonly notificationService: NotificationService,
    private readonly detailsService: DetailsService,
  ) {
  }

  ngAfterViewInit() {
    this.registerClipboardEvents();
  }

  registerClipboardEvents() {
    this.emailClipboard = new Clipboard('.email-output' + this.userIndex, {
      text: trigger => {
        return trigger.innerHTML.trim();
      },
    });
    this.emailClipboard.on('success', (e) => success(e, this.notificationService));
    this.emailClipboard.on('error', (e) => fail(e, this.notificationService));

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

  onDetailsClick() {
    this.tabSelectionService.loadingEvent.next(true);
    this.detailsService.updateDetailsObj(this.userData);
    if (this.selectDetailsTimeout) clearTimeout(this.selectDetailsTimeout);
    this.selectDetailsTimeout = setTimeout(() => {
      this.tabSelectionService.tabSwitchEvent.next(route.DETAILS);
      this.tabSelectionService.loadingEvent.next(false);
    }, 250);
  }

  ngOnDestroy() {
    if (this.emailClipboard) this.emailClipboard.destroy();
  }
}
