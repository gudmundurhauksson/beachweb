import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'app';

  constructor(public authService:AuthService ) {
    console.log(authService);

    authService.isLoggedIn();
  }

  logout() : void {
    console.log("logging out ...");
    this.authService.logout();
  }
}
