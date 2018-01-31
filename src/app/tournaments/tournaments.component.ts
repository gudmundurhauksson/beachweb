import { Component, OnInit } from '@angular/core';
import { Tournament } from '../models/tournament';
import { DataService } from '../data.service';
import { _createDefaultCookieXSRFStrategy } from '@angular/http/src/http_module';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { _appIdRandomProviderFactory } from '@angular/core/src/application_tokens';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit {

  public tournaments: Tournament[];
  public selected: Tournament;

  constructor(private _data: DataService, router: Router, private _auth: AuthService) {
    this.selected = new Tournament();
    this.selected.id = -1;

    if(!_auth.isLoggedIn() ||!_auth.player.isAdmin) {
      router.navigate(['']);
    }

  }

  open(): void {
    if (this.selected == null || this.selected.id < 0) {
      return;
    }

    this._data.openRegistration(this.selected.id).subscribe((s : any) => {
      console.log(s);

      var idx = this.tournaments.indexOf(this.selected);
      this.tournaments.splice(idx, 1, <Tournament>s);

      this.selected = new Tournament();
    },
      (error: any) => {
        console.log(error);
      });
  }

  close(): void {
    if (this.selected == null || this.selected.id < 0) {
      return;
    }

    console.log(this.selected);

    this._data.closeRegistration(this.selected.id).subscribe((s: any) => {
      console.log(s);
      
      var idx = this.tournaments.indexOf(this.selected);
      this.tournaments.splice(idx, 1, <Tournament>s);

      this.selected = new Tournament();
    },
      (error: any) => {
        console.log(error);
      });
  }

  ngOnInit() {

    this._data.getRemainingTournaments().subscribe((s: any) => {
      this.tournaments = <Tournament[]>s;
      console.log(s);
    });

  }

  onTournamentSelected(tournament: Tournament): void {
    this.selected = tournament;
  }

}
