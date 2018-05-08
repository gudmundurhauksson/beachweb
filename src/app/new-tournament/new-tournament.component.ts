import { Component, OnInit } from '@angular/core';
import { Tournament } from '../models/tournament';
import { DataService } from '../data.service';
import { BeachLocation } from '../models/beachlocation';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-tournament',
  templateUrl: './new-tournament.component.html',
  styleUrls: ['./new-tournament.component.scss']
})
export class NewTournamentComponent implements OnInit {

  public tournament: Tournament;
  public locations: BeachLocation[];
  public selectedLocation: BeachLocation;

  public isKk: boolean;
  public isKvk: boolean;
  public isYouthKk: boolean;
  public isYouthKvk: boolean;

  constructor(private data: DataService, private auth: AuthService, private router: Router) {
    this.tournament = new Tournament();
    this.isKk = false;
    this.isKvk = false;
    this.isYouthKk = false;
    this.isYouthKvk = false;

    if (!auth.isLoggedIn() || !auth.player.isAdmin) {
      this.router.navigate(['']);
    }
  }

  register(): void {

    this.tournament.type =
      (this.isKk ? 0x01 : 0x00) |
      (this.isKvk ? 0x02 : 0x00) |
      (this.isYouthKk ? 0x04 : 0x00) |
      (this.isYouthKvk ? 0x08 : 0x00);
    console.log(this.selectedLocation);

    this.tournament.locationId = this.selectedLocation.id;

    this.data.registerTournament(this.tournament).subscribe(s => {
      this.router.navigate(['admin-tournaments']);
    }, (error: any) => {

    });
  }

  ngOnInit() {
    this.data.getLocations().subscribe((s: any) => {
      this.locations = <BeachLocation[]>s;
      console.log(s);
    });
  }

}
