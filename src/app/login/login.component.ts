import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {Player} from '../models/player';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public player:Player;

  constructor(private _data : DataService, private _auth: AuthService) { 
    this.player = new Player();
  }

  ngOnInit() {

  }

   login() {
    console.log('logging in');
    this._auth.login(this.player);
  }

}
