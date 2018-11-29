/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TabSelectionService} from '../../../@core/services/tab-selection.service';
import {DetailsService} from '../../../@core/services/details.service';
import {ResultsService} from '../../../@core/services/results.service';
import {AuthService} from '../../../@core/services/auth.service';
import {Subscription} from 'rxjs';
import route from '../../../@core/enums/route.enum';

@Component({
  selector: 'app-header',
  styleUrls: [
    './header.component.scss',
    '../../styles/spinner.scss',
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  title: string = 'Hochschul Active Directory Lookup Tool';
  tabs: any = [];
  selectedTabIndex: number = 0;
  tabSwitchSubscription: Subscription;
  isLoading: boolean = true;
  loadingSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly tabSelectionService: TabSelectionService,
    private readonly resultsService: ResultsService,
    private readonly detailsService: DetailsService,
    private readonly authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.updateTabs();
    this.tabSwitchSubscription = this.tabSelectionService.tabSwitchEvent.subscribe(index => {
      this.selectedTabIndex = index;
      this.updateTabs();
      setTimeout(() => {
        if (this.tabs[index]) {
          this.router.navigate([this.tabs[index]['route']]);
        }
      }, 50);
    });
    this.loadingSubscription = this.tabSelectionService.loadingEvent.subscribe(loading => {
      this.isLoading = loading;
    });
  }

  updateTabs() {
    this.tabs = [
      {label: 'Search', disabled: this.getSearchValidation(), route: 'search', enum: route.SEARCH},
      {label: 'Results', disabled: this.getResultsValidation(), route: 'results', enum: route.RESULTS},
      {label: 'Details', disabled: this.getDetailsValidation(), route: 'details', enum: route.DETAILS}
    ];
    this.tabs = this.tabs.filter(entry => {
      return !entry['disabled'];
    });
  }

  getSearchValidation() {
    return !this.authService.isLoggedIn();
  }

  getResultsValidation() {
    return !this.resultsService.hasResults();
  }

  getDetailsValidation() {
    return !this.detailsService.hasDetails();
  }

  onTabChange(index) {
    if (index !== this.tabSelectionService.selectedTabIndex) {
      this.tabSelectionService.tabSwitchEvent.next(index);
    }
  }

  ngOnDestroy() {
    if (this.tabSwitchSubscription) this.tabSwitchSubscription.unsubscribe();
    if (this.loadingSubscription) this.loadingSubscription.unsubscribe();
  }
}
