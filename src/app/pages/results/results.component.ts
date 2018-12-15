/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import {Component} from '@angular/core';
import {ResultsService} from '../../@core/services/results.service';

@Component({
  selector: 'app-results',
  styleUrls: ['./results.component.scss'],
  templateUrl: './results.component.html',
})
export class ResultsComponent {

  constructor(
    public readonly resultsService: ResultsService,
  ) {}

  getSearchInput(): string {
    const searchObj = this.resultsService.currentSearchObj;
    let searchInput = searchObj['id'] && searchObj['id'].length ? searchObj['id'] + '; ' : '';
    if (searchObj['name'] && searchObj['name'].length) {
      searchInput += searchObj['name'] + '; ';
    }
    if (searchObj['email'] && searchObj['email'].length) {
      searchInput += searchObj['email'];
    }
    return searchInput;
  }
}
