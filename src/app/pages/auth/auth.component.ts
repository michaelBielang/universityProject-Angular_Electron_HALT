/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../@core/services/auth.service';
import { TabSelectionService } from '../../@core/services/tab-selection.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthCustomValidators, validationMessagesDE } from './auth.validators';
import { MyErrorStateMatcher } from '../../@core/models/error-state-matcher.model';
import { NotificationService } from '../../@core/services/notification.service';
import route from '../../@core/enums/route.enum';

@Component({
  selector: 'app-auth',
  styleUrls: ['./auth.component.scss'],
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  hidePw = true;
  readonly customValidators = new AuthCustomValidators();
  readonly errorMessages = validationMessagesDE();
  readonly matcher = new MyErrorStateMatcher();
  loginTimeout;

  constructor(
    private readonly authService: AuthService,
    private readonly tabSelectionService: TabSelectionService,
    private readonly notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const idRegex = this.mailAddressRegex();
    this.authForm = new FormGroup({
      'id': new FormControl('', [
        Validators.required,
        Validators.pattern(idRegex),
      ]),
      'pw': new FormControl('', [
        Validators.required,
      ]),
    });
  }

  onAuth() {
    this.tabSelectionService.loadingEvent.next(true);
    const id = this.authForm.get('id')['value'];
    const pw = this.authForm.get('pw')['value'];

    if (id == undefined || id === '' || pw == undefined || pw === '') {
      this.tabSelectionService.loadingEvent.next(false);
    } else {
      if (this.loginTimeout) {
        clearTimeout(this.loginTimeout);
      }
      this.loginTimeout = setTimeout(() => {
        this.authService.authRequest(id, pw).subscribe(res => {
          this.authService.setSession(res.json()['userObj']);
          this.notificationService.showNotification(
            'success',
            null,
            'login successfull',
          );
          setTimeout(() => {
            this.tabSelectionService.tabSwitchEvent.next(route.SEARCH);
            this.tabSelectionService.loadingEvent.next(false);
          }, 250);

        }, err => {
          this.notificationService.showNotification(
            'error',
            'login failed!',
            err['message'] || '',
          );
          this.tabSelectionService.loadingEvent.next(false);
        });
      }, 250);
    }
  }

  private mailAddressRegex() {
    // To refactor Regex - help: https://regex101.com/
    const rePrefix = /[a-z0-9!#$%&'*+/=?^_`{|}~-]{2,}/;
    const reMiddle = /(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]{1,})*/;
    const reSuffix = /(?:@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.){2,}[a-z0-9](?:[a-z0-9-]{2,}[a-z0-9])?)?/;
    return new RegExp(rePrefix.source + reMiddle.source + reSuffix.source);
  }

  ObjKeys(input) {
    // Make Object.keys() available to DOM
    if (input && input !== 'undefined' && typeof input === 'object') {
      return Object.keys(input);
    }
    return undefined;
  }
}
