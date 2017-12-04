import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {Player} from '../models/player';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public player:Player;

  constructor(private _data : DataService, private _auth: AuthService) { 
    this.player = new Player();
  }

  ngOnInit() {

  }

  login() {
    this._auth.login(this.player);
  }

}
