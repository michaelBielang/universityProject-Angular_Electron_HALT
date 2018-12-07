/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';

import {throwIfAlreadyLoaded} from './module-import-guard';
import {ServiceModule} from './services/service.module';


@NgModule({
  imports: [
    CommonModule,
  ],
  entryComponents: [],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...ServiceModule.forRoot().providers,
      ],
    };
  }
}
