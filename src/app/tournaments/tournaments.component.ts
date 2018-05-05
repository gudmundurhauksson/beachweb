import { Component, OnInit } from '@angular/core';
import { Tournament } from '../models/tournament';
import { DataService } from '../data.service';
import { _createDefaultCookieXSRFStrategy } from '@angular/http/src/http_module';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { _appIdRandomProviderFactory } from '@angular/core/src/application_tokens';

/* FOR ADMINS */
@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit {

  public tournaments: Tournament[];
  public selected: Tournament;

  constructor(private data: DataService, router: Router, private _auth: AuthService) {
    this.selected = new Tournament();
    this.selected.id = -1;

    if (!_auth.isLoggedIn() || !_auth.player.isAdmin) {
      router.navigate(['']);
    }

    this.refresh();
    
  }

  refresh() {
    var date = new Date();
    this.data.getTournaments(date.getFullYear()).subscribe((s: any) => {
      this.tournaments = <Tournament[]>s;
      console.log(this.tournaments);
    }, error => {

    });

  }

  open(): void {
    if (this.selected == null || this.selected.id < 0) {
      return;
    }

    this.data.openRegistration(this.selected.id).subscribe((s: any) => {
      this.selected = new Tournament();
    this.refresh();
    },
      (error: any) => {
        console.log(error);
      });
  }

  close(): void {
    if (this.selected == null || this.selected.id < 0) {
      return;
    }

    console.log("closing: " + this.selected);

    this.data.closeRegistration(this.selected.id).subscribe((s: any) => {
      this.selected = new Tournament();
      this.refresh();
    },
      (error: any) => {
        console.log(error);
      });
  }

  start(): void {
    if (this.selected == null || this.selected.id < 0) {
      return;
    }

    this.data.startTournament(this.selected.id).subscribe((s: any) => {
      this.selected = new Tournament();
      this.refresh();
    },
      (error: any) => {
        console.log(error);
      });
  }

  end(): void {
    if (this.selected == null || this.selected.id < 0) {
      return;
    }

    this.data.endTournament(this.selected.id).subscribe((s: any) => {
      this.selected = new Tournament();
      this.refresh();
    },
      (error: any) => {
        console.log(error);
      });
  }

  ngOnInit() {
  }

  onTournamentSelected(tournament: Tournament): void {
    this.selected = tournament;
  }

}
