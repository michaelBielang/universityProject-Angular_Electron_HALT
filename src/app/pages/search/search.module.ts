/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import {NgModule} from '@angular/core';
import {SearchComponent} from './search.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  MatAutocompleteModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatTooltipModule,
} from '@angular/material';

const ANGULAR_MATERIAL = [
  MatTooltipModule,
  MatInputModule,
  MatFormFieldModule,
  MatRadioModule,
  MatAutocompleteModule,
  MatIconModule,
  MatSelectModule,
];

const BASE_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule
];

@NgModule({
  imports: [
    ...ANGULAR_MATERIAL,
    ...BASE_MODULES,
  ],
  declarations: [
    SearchComponent,
  ],
})
export class SearchModule {
}
