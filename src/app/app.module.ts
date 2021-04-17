import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InscriptionComponent } from './inscription/inscription.component';

import { AuthentificationComponent } from './authentification/authentification.component';
import {HttpClientModule} from "@angular/common/http";
import { GereUserComponent } from './gere-user/gere-user.component';
@NgModule({
  declarations: [
    AppComponent,
    InscriptionComponent,

    AuthentificationComponent,

    GereUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
