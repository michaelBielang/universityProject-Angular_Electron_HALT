/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Component, OnInit } from '@angular/core';
import { TabSelectionService } from '../../@core/services/tab-selection.service';
import { SearchService } from '../../@core/services/search.service';
import route from '../../@core/enums/route.enum';

@Component({
  selector: 'app-search',
  styleUrls: ['./search.component.scss'],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  constructor(
    private readonly tabSelectionService: TabSelectionService,
    public readonly searchService: SearchService,
  ) { }

  ngOnInit() {
  }

  onSearchBtnClick() {
    this.tabSelectionService.tabSwitchEvent.next(route.RESULTS);
  }
}
