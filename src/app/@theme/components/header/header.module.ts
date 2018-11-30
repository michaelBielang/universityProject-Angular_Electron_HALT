/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

 import { NgModule, ModuleWithProviders } from '@angular/core';
 import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';

import {
  MatTooltipModule,
  MatTabsModule,
  MatProgressSpinnerModule,
} from '@angular/material';

const ANGULAR_MATERIAL = [
  MatTooltipModule,
  MatTabsModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [
    CommonModule,
    ...ANGULAR_MATERIAL,
  ],
  exports: [
    HeaderComponent,
  ],
  entryComponents: [
    HeaderComponent,
  ],
  declarations: [
    HeaderComponent,
  ],
})
export class HeaderModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: HeaderModule,
      providers: [
      ],
    };
  }
}
