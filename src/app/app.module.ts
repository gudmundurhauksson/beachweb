import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }  from '@angular/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DataService } from './data.service';
import { CompetitionsComponent } from './competitions/competitions.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LoginComponent } from './login/login.component';
import { NewuserComponent } from './newuser/newuser.component';
import { AuthService } from './auth.service';

import { CookieService } from 'angular2-cookie';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewTournamentComponent } from './new-tournament/new-tournament.component';
import { NewLocationComponent } from './new-location/new-location.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    CompetitionsComponent,
    LoginComponent,
    NewuserComponent,
    ChangePasswordComponent,
    DashboardComponent,
    NewTournamentComponent,
    NewLocationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [DataService, AuthService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
