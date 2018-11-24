/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Component } from '@angular/core';
import { ResultsService } from '../../@core/services/results.service';

@Component({
  selector: 'app-results',
  styleUrls: ['./results.component.scss'],
  templateUrl: './results.component.html',
})
export class ResultsComponent {

  constructor(
    public readonly resultsService: ResultsService,
  ) { }
}
