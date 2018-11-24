/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notification.service';
import { TabSelectionService } from './tab-selection.service';
import { SearchService } from './search.service';
import { ResultsService } from './results.service';
import { DetailsService } from './details.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';

const SERVICES = [
  NotificationService,
  TabSelectionService,
  SearchService,
  ResultsService,
  DetailsService,
  AuthService,
  AuthGuard,
];

@NgModule({
  imports: [
    CommonModule,
  ],
})
export class ServiceModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ServiceModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
