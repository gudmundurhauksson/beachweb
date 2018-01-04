import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {



  constructor(private _data: DataService, private _auth: AuthService) {


  }

  isAdmin(): boolean {
    if (!this._auth.isLoggedIn()) {
      return false;
    }

    return this._auth.player.isAdmin;
  }

  isLoggedIn():boolean {
    return this._auth.isLoggedIn();
  }

  ngOnInit() {
  }

}
