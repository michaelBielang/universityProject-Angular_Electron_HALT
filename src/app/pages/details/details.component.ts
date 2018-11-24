/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { Component, OnInit } from '@angular/core';
import { TabSelectionService } from '../../@core/services/tab-selection.service';
import { DetailsService } from '../../@core/services/details.service';

@Component({
  selector: 'app-details',
  styleUrls: ['./details.component.scss'],
  templateUrl: './details.component.html',
})
export class DetailsComponent implements OnInit {
  constructor(
    private readonly tabSelectionService: TabSelectionService,
    public readonly detailsService: DetailsService,
  ) { }

  ngOnInit() {
  }
}
