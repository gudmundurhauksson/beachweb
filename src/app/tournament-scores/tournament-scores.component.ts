import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { ScoresModel } from '../models/scoresmodel';
import { TournamentScore } from '../models/tournamentScore';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-tournament-scores',
  templateUrl: './tournament-scores.component.html',
  styleUrls: ['./tournament-scores.component.scss']
})
export class TournamentScoresComponent implements OnInit {

  public scores: TournamentScore[];

  public isScoreLoaded: boolean;

  public yearNow: number;
  public years: number[];
  public selectedYear: number;
  public selectedType: number;
  public isWaiting: boolean;

  constructor(private data: DataService, private auth: AuthService) {

    this.isScoreLoaded = false;
    this.isWaiting = false;

    this.selectedType = 0x02;

    if (auth.isLoggedIn()) {
      this.selectedType = auth.player.isMale ? 0x01 : 0x02;
    }

    var date = new Date();
    this.yearNow = date.getFullYear();

    this.years = new Array();
    for (var i = 2016; i <= this.yearNow; i++) {
      this.years.push(i);
    }

    this.selectedYear = this.yearNow;
    this.loadScores(this.selectedYear, this.selectedType);
  }

  loadScores(year: number, type: number) {

    this.isWaiting = true;
    this.selectedYear = year;
    this.selectedType = type;

    this.isScoreLoaded = false;

    this.data.getTournamentPlayersScoresByTypeAndYear(type, year).subscribe((s: any) => {
      this.isWaiting = false;
      this.scores = s;
      this.isScoreLoaded = true;
      console.log(s);
    }, error => {
      this.isWaiting = false;
    });
  }

  loggedInPlayerId() {
    if (!this.auth.isLoggedIn()) {
      return "";
    }

    return this.auth.player.id;
  }

  ngOnInit() {
  }

}


