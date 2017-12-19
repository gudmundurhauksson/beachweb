import { Component, OnInit } from '@angular/core';
import { Tournament } from '../models/tournament';
import { DataService } from '../data.service';
import { _createDefaultCookieXSRFStrategy } from '@angular/http/src/http_module';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit {

  public tournaments: Tournament[];
  public tournamentId: number;

  constructor(private _data: DataService) {
    this.tournamentId = -1;
  }

  open(): void {
    if (this.tournamentId == -1) {
      return;
    }

    this._data.openRegistration(this.tournamentId).subscribe(s => {
      console.log(s);
    },
      (error: any) => {
        console.log(error);
      });
  }

  close(): void {
    if (this.tournamentId == -1) {
      return;
    }

    this._data.closeRegistration(this.tournamentId).subscribe(s => {
      console.log(s);
    },
      (error: any) => {
        console.log(error);
      });
  }

  ngOnInit() {

    this._data.getTournaments().subscribe((s: any) => {
      this.tournaments = <Tournament[]>s;
      console.log(s);
    });

  }

}
