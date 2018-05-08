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
import { TournamentsComponent } from './tournaments/tournaments.component';
import { TournamentRegistrationComponent } from './tournament-registration/tournament-registration.component';
import { TournamentRegistrationIdComponent } from './tournament-registration-id/tournament-registration-id.component';
import { MyTournamentsComponent } from './my-tournaments/my-tournaments.component';
import { PaymentComponent } from './payment/payment.component';
import { KassComponent } from './kass/kass.component';
import { AurComponent } from './aur/aur.component';
import { ScoresComponent } from './scores/scores.component';
import { TournamentScoresComponent } from './tournament-scores/tournament-scores.component';
import { AllRegistrationsComponent } from './all-registrations/all-registrations.component';
import { ArrangeMatchesComponent } from './arrange-matches/arrange-matches.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
// import { SimpleTimer } from 'ng2-simple-timer';
import { ArrangeMatchesTimesComponent } from './admin/arrange-matches-times/arrange-matches-times.component';
import { TournamentOverviewComponent } from './tournament-overview/tournament-overview.component';
import { EnterMatchResultComponent } from './enter-match-result/enter-match-result.component';
import { RootHomeComponent } from './root-home/root-home.component';

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
    NewLocationComponent,
    TournamentsComponent,
    TournamentRegistrationComponent,
    TournamentRegistrationIdComponent,
    MyTournamentsComponent,
    PaymentComponent,
    KassComponent,
    AurComponent,
    ScoresComponent,
    TournamentScoresComponent,  
    AllRegistrationsComponent, ArrangeMatchesComponent, ForgotPasswordComponent, ResetPasswordComponent, ArrangeMatchesTimesComponent, TournamentOverviewComponent, EnterMatchResultComponent, RootHomeComponent
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
  providers: [DataService, AuthService, CookieService/*, SimpleTimer*/],
  bootstrap: [AppComponent]
})
export class AppModule { }
