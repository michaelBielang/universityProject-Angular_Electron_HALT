/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import {Injectable} from '@angular/core';
import {BodyOutputType, Toast, ToasterConfig, ToasterService} from 'angular2-toaster';

@Injectable()
export class NotificationService {
  config: ToasterConfig;
  position = 'toast-bottom-right';
  animationType = 'slideUp';
  title = 'Not always required, use null';
  content = `can be html encoded.`;
  timeout = 5000;
  toastsLimit = 5;
  type = 'default';
  isNewestOnTop = true;
  isHideOnClick = true;
  isDuplicatesPrevented = false;
  isCloseButton = false;
  types: string[] = ['default', 'info', 'success', 'warning', 'error'];
  animations: string[] = ['fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'];
  positions: string[] = ['toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center',
    'toast-top-right', 'toast-bottom-right', 'toast-bottom-center', 'toast-bottom-left', 'toast-center'];
  quotes = [
    {title: null, body: 'We rock at <i>Angular</i>'},
    {title: null, body: 'Titles are not always needed'},
    {title: null, body: 'Toastr rock!'},
    {title: 'What about nice html?', body: '<b>Sure you <em>can!</em></b>'},
  ];

  constructor(private toasterService: ToasterService) {
  }

  getConfig() {
    return this.config;
  }

  makeDefaultToast() {
    this.showNotification(this.type, this.title, this.content);
  }

  showNotification(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      positionClass: this.position,
      timeout: this.timeout,
      newestOnTop: this.isNewestOnTop,
      tapToDismiss: this.isHideOnClick,
      preventDuplicates: this.isDuplicatesPrevented,
      animation: this.animationType,
      limit: this.toastsLimit,
    });
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: this.timeout,
      showCloseButton: this.isCloseButton,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }

  overrideTimeoutInMs(time: number) {
    this.timeout = time;
  }
}
