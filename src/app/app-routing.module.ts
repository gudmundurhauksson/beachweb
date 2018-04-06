import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';     
import { AboutComponent } from './about/about.component';  
import { CompetitionsComponent } from './competitions/competitions.component';  
import { LoginComponent } from './login/login.component';
import { NewuserComponent } from './newuser/newuser.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { componentFactoryName } from '@angular/compiler';
import { NewLocationComponent } from './new-location/new-location.component';
import { NewTournamentComponent } from './new-tournament/new-tournament.component';
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

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'about/:id', 
    component: AboutComponent
  },
  {
    path: 'tournaments', 
    component: TournamentRegistrationComponent
  },
  {
    path: 'tournaments/:id/register', 
    component: TournamentRegistrationIdComponent
  }
  ,  
  {
    path: 'login',
    component: LoginComponent
  }, 
  {
    path: 'newuser',
    component:NewuserComponent
  },
  {
    path: 'newuser/:id',
    component:NewuserComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'new-location',
    component: NewLocationComponent
  },
  {
    path: 'new-tournament',
    component: NewTournamentComponent
  },
  {
    path:'admin-tournaments',
    component: TournamentsComponent
  },
  {
    path:'my-tournaments',
    component: MyTournamentsComponent
  },
  {
    path:'payment/:id',
    component: PaymentComponent
  },
  {
    path:'payment/:id/kass',
    component: KassComponent
  },
  {
    path:'payment/:id/aur',
    component: AurComponent
  },
  
  {
    path:'scores/tournaments',    
    component: TournamentScoresComponent
  },  
  
  /*{
    path:'scores/:year',
    component:ScoresComponent
  },*/

  {
    path:'all-registrations/:tournamentId',
    component: AllRegistrationsComponent
  },
  {
    path: 'arrange-matches/:tournamentId/:division',
    component: ArrangeMatchesComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
