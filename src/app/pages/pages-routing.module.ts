/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AuthComponent } from './auth/auth.component';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';
import { DetailsComponent } from './details/details.component';
import { AuthGuard } from '../@core/services/auth-guard.service';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: '',
      component: AuthComponent,
    },
    {
      path: 'search',
      component: SearchComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'results',
      component: ResultsComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'details',
      component: DetailsComponent,
      canActivate: [AuthGuard],
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
