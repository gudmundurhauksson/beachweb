import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'app';

  isIn = false;   // store state
  toggleState() { // click handler
      let bool = this.isIn;
      this.isIn = bool === false ? true : false; 
  }

  constructor(public authService:AuthService, private router: Router ) {
    console.log(authService);
    authService.isLoggedIn();
  }

  logout() : void {    
    this.authService.logout();
    this.router.navigate(['']);
  }
}
