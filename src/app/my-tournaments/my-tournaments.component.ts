import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { Team } from '../models/team';

@Component({
  selector: 'app-my-tournaments',
  templateUrl: './my-tournaments.component.html',
  styleUrls: ['./my-tournaments.component.scss']
})
export class MyTournamentsComponent implements OnInit {

  public teams: Team[];

  constructor(private _data: DataService, private _auth: AuthService) {
    this.fetching = false;
    this.teams = null;
  }

  private fetching: boolean;

  getTeams(): Team[] {

    if (this.fetching) {
      return null;
    }

    if (this.teams != null) {
      return this.teams;
    }

    if (this._auth.player == undefined || this._auth.player === undefined || this._auth.player == null) {
      return null;
    }

    this.fetching = true;

    this._data.getTournamentsStatus(this._auth.player).subscribe((s: any) => {
      this.teams = <Team[]>s;

      this.fetching = false;
    }, (err: any) => {
      console.log(err);

      this.fetching = false;
    });


  }

  ngOnInit() {
  }

}
