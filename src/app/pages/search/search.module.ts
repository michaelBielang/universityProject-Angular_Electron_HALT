/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';

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
    SearchComponent,
  ],
})
export class SearchModule { }
