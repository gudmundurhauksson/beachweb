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
  public isWaiting : boolean;

  constructor(private auth: AuthService, private data: DataService) {

    this.tournaments = new Array();
    this.oldTournaments = new Array();
    this.isWaiting = false;

    var date = new Date();
    this.yearNow = date.getFullYear();

    var wait = false;
    this.isWaiting = true;

    for (var i = date.getFullYear(); i >= 2016; i--) {

      data.getTournaments(i).subscribe((s: any) => {
        var local = <Tournament[]>s;        

        // just wait for the first call to go through
        this.isWaiting = false;
        
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
          this.isWaiting = false;
        });
        
      }, (error: any) => {
        this.isWaiting = false;
        console.log(error);
      });
    }

  }

  ngOnInit() {
  }

  isAdmin(): boolean {
    if (!this.auth.isLoggedIn()) {
      return false;
    }

    return this.auth.player.isAdmin;
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

}
