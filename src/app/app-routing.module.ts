import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';     
import { AboutComponent } from './about/about.component';  
import { CompetitionsComponent } from './competitions/competitions.component';  
import { UsersComponent } from './users/users.component';
import { NewuserComponent } from './newuser/newuser.component';

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
    path: 'users',
    component: UsersComponent
  }, 
  {
    path: 'newuser',
    component:NewuserComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
