/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details.component';

import {
  MatTooltipModule,
} from '@angular/material';

const ANGULAR_MATERIAL = [
  MatTooltipModule,
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
    DetailsComponent,
  ],
})
export class DetailsModule { }
