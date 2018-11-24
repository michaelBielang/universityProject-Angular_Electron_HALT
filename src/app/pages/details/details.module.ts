/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { NgModule } from '@angular/core';
import { DetailsComponent } from './details.component';

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
    DetailsComponent,
  ],
})
export class DetailsModule { }
