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

  public remainingTournaments: Tournament[];
  public previousTournaments: Tournament[];

  constructor(private _auth: AuthService, private _data: DataService) {    
    
    _data.getRemainingTournaments(2018).subscribe((s: any) => {
      var local = <Tournament[]>s;

      _data.getLocations().subscribe((l: any) => {
        for (var t = 0; t < local.length; t++) {

          var locations = <BeachLocation[]>l;
          
          for (var tmp = 0; tmp< locations.length; tmp++) {
            if(locations[tmp].id == local[t].locationId) {
              local[t].location = locations[tmp];
              break;
            }
          }          
        }
        
        this.remainingTournaments = local;
      }, (err: any) => {

      });

    }, (error: any) => {
      console.log(error);
    });

  }

  ngOnInit() {
  }

}
