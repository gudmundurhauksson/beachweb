import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { Tournament } from '../models/tournament';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public ongoings: Tournament[];

  constructor(private data: DataService, private auth: AuthService, private router : Router) {
    this.ongoings = new Array();

    this.data.getOngoingTournaments().subscribe((s:any) => {
      this.ongoings = <Tournament[]>s;
    });
  }

  isAdmin(): boolean {
    if (!this.auth.isLoggedIn()) {
      return false;
    }

    return this.auth.player.isAdmin;
  }

  isLoggedIn():boolean {
    return this.auth.isLoggedIn();
  }

  openTournament(tournamentId: number) {
    this.router.navigate(['/tournaments/' + tournamentId]);
  }

  ngOnInit() {
  }

}
