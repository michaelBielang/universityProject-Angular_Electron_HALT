/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Component, OnInit } from '@angular/core';
import { TabSelectionService } from '../../@core/services/tab-selection.service';
import { ResultsService } from '../../@core/services/results.service';

@Component({
  selector: 'app-results',
  styleUrls: ['./results.component.scss'],
  templateUrl: './results.component.html',
})
export class ResultsComponent implements OnInit {
  constructor(
    private readonly tabSelectionService: TabSelectionService,
    public readonly resultsService: ResultsService,
  ) { }

  ngOnInit() {
  }
}
