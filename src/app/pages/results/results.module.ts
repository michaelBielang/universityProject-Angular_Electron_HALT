/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results.component';
import { ResultEntryComponent } from './result-entry/result-entry.component';

import {
  MatTooltipModule,
  MatCardModule,
  MatIconModule,
} from '@angular/material';

const ANGULAR_MATERIAL = [
  MatTooltipModule,
  MatCardModule,
  MatIconModule,
];

const BASE_MODULES = [
  CommonModule
];

@NgModule({
  imports: [
    ...ANGULAR_MATERIAL,
    ...BASE_MODULES,
  ],
  declarations: [
    ResultsComponent,
    ResultEntryComponent,
  ],
})
export class ResultsModule { }
