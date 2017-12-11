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
    path: 'competitions', 
    component: CompetitionsComponent
  }
  ,
  {
    path: 'competitions/:id',
    component: CompetitionsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }, 
  {
    path: 'newuser',
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
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
