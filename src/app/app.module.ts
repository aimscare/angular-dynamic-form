import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {DropdownModule} from 'primeng/primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import {CountryService} from './../service/country-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,BrowserModule,FormsModule,HttpModule,
    ReactiveFormsModule,DropdownModule
  ],
  providers: [CountryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
