/**
 * @author Christoph Bichlmeier
 * @license UNLICENSED
 */

import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CoreModule } from './@core/core.module';
import { ToasterModule } from 'angular2-toaster';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

const BASE_MODULES = [
  BrowserModule,
  BrowserAnimationsModule
];

@NgModule({
  imports: [
    ...BASE_MODULES,
    AppRoutingModule,
    ToasterModule.forRoot(),
    CoreModule.forRoot(),
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: './' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
