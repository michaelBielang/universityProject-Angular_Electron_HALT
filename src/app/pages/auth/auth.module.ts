/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthComponent} from './auth.component';
import {MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule,} from '@angular/material';

const BASE_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule
];

const ANGULAR_MATERIAL = [
  MatTooltipModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
];

@NgModule({
  imports: [
    ...ANGULAR_MATERIAL,
    ...BASE_MODULES,
  ],
  declarations: [
    AuthComponent,
  ],
})
export class AuthModule {
}
