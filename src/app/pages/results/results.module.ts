/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { NgModule } from '@angular/core';
import { ResultsComponent } from './results.component';
import { ResultEntryComponent } from './result-entry/result-entry.component';

import {
  MatTooltipModule,
} from '@angular/material';

const ANGULAR_MATERIAL = [
  MatTooltipModule,
];

@NgModule({
  imports: [
    ...ANGULAR_MATERIAL,
  ],
  declarations: [
    ResultsComponent,
    ResultEntryComponent,
  ],
})
export class ResultsModule { }
