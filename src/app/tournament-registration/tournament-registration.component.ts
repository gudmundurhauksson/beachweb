import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { Tournament } from '../models/tournament';
import { BeachLocation } from '../models/beachlocation';

@Component({
  selector: 'app-tournament-registration',
  templateUrl: './tournament-registration.component.html',
  styleUrls: ['./tournament-registration.component.scss']
})
export class TournamentRegistrationComponent implements OnInit {

  public tournaments: Array<Tournament>;
  public oldTournaments: Array<Tournament>;
  public yearNow: number;

  constructor(private _auth: AuthService, private data: DataService) {

    this.tournaments = new Array();
    this.oldTournaments = new Array();

    var date = new Date();
    this.yearNow = date.getFullYear();

    var wait = false;

    for (var i = date.getFullYear(); i >= 2016; i--) {

      data.getTournaments(i).subscribe((s: any) => {
        var local = <Tournament[]>s;        

        data.getLocations().subscribe((l: any) => {
          for (var t = 0; t < local.length; t++) {

            var locations = <BeachLocation[]>l;

            for (var tmp = 0; tmp < locations.length; tmp++) {
              if (locations[tmp].id == local[t].locationId) {
                local[t].location = locations[tmp];
                local[t].year = parseInt(local[t].date.split('-')[0]);
                break;
              }
            }
          }

          for (var ll = 0; ll < local.length; ll++) {
            if (local[ll].year == this.yearNow) {
              this.tournaments.push(local[ll]);
            } else {
              this.oldTournaments.push(local[ll]);
            }
          }

          this.tournaments.sort(function (a, b) { return b.dateTicks - a.dateTicks });
          this.oldTournaments.sort(function (a, b) { return b.dateTicks - a.dateTicks });
        }, (err: any) => {

        });
      }, (error: any) => {
        console.log(error);
      });
    }

  }

  ngOnInit() {
  }

  isAdmin(): boolean {
    if (!this._auth.isLoggedIn()) {
      return false;
    }

    return this._auth.player.isAdmin;
  }

  isLoggedIn(): boolean {
    return this._auth.isLoggedIn();
  }

}
