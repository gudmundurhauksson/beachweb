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
  public isWaiting : boolean;

  constructor(private data: DataService, router: Router, private auth: AuthService) {
    this.selected = new Tournament();
    this.selected.id = -1;
    this.isWaiting = false;

    if (!auth.isLoggedIn() || !auth.player.isAdmin) {
      router.navigate(['']);
    }

    this.refresh();
    
  }

  refresh() {
    this.isWaiting = true;
    var date = new Date();
    this.data.getTournaments(date.getFullYear()).subscribe((s: any) => {
      this.isWaiting = false;
      this.tournaments = <Tournament[]>s;      
    }, error => {
      this.isWaiting = false;
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

  save(tournament: Tournament) {
    this.data.updateTournament(tournament).subscribe((s:any) => {
      this.selected = <Tournament>s;
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
