/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import {NgModule} from '@angular/core';
import {PagesComponent} from './pages.component';
import {PagesRoutingModule} from './pages-routing.module';
import {HeaderModule} from '../@theme/components/header/header.module';
import {AuthModule} from './auth/auth.module';
import {SearchModule} from './search/search.module';
import {ResultsModule} from './results/results.module';
import {DetailsModule} from './details/details.module';

import {MatFormFieldModule, MatInputModule, MatTooltipModule,} from '@angular/material';

const ANGULAR_MATERIAL = [
  MatFormFieldModule,
  MatTooltipModule,
  MatInputModule,
];

const PAGES_MODULES = [
  HeaderModule,
  AuthModule,
  SearchModule,
  ResultsModule,
  DetailsModule,
];

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ...PAGES_MODULES,
    ...ANGULAR_MATERIAL,
  ],
  exports: [
    ...PAGES_COMPONENTS,
  ],
  entryComponents: [
    ...PAGES_COMPONENTS,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
  providers: [],
})
export class PagesModule {
}
