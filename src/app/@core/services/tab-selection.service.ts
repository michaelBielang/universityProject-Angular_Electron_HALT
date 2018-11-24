/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import route from '../enums/route.enum';

@Injectable()
export class TabSelectionService {
  public tabSwitchEvent = new Subject<number>();
  selectedTabIndex: number = route.SEARCH;
  public loadingEvent = new Subject<boolean>();
  isLoading: boolean = false;

  constructor() {
    setTimeout(() => {
      this.tabSwitchEvent.subscribe(index => {
        this.selectedTabIndex = index;
      });
      this.loadingEvent.subscribe(loading => {
        this.isLoading = loading;
      });
    }, 20);
  }

}
