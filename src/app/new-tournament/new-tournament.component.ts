import { Component, OnInit } from '@angular/core';
import { Tournament } from '../models/tournament';
import { DataService } from '../data.service';
import { BeachLocation } from '../models/beachlocation';

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

  constructor(private _data : DataService) { 
    this.tournament = new Tournament();  
    this.isKk = false;
    this.isKvk = false;
    this.isYouthKk = false;
    this.isYouthKvk = false;
  }

  register() : void { 

    this.tournament.type = 
      (this.isKk ? 0x01 : 0x00) | 
      (this.isKvk ? 0x02 : 0x00) |
      (this.isYouthKk ? 0x04 : 0x00) |
      (this.isYouthKvk ? 0x08 : 0x00);
      console.log(this.selectedLocation);

      this.tournament.locationId = this.selectedLocation.id;

    this._data.registerTournament(this.tournament).subscribe(s => {
      
    }, 
    (error: any) => {
      
    });
  }

  ngOnInit() {
    this._data.getLocations().subscribe((s : any) => {
      this.locations = <BeachLocation[]>s;      
      console.log(s);
    });
  }

}
