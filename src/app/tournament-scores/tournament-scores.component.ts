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
  public isMenSelected: boolean;

  constructor(private data: DataService, private auth: AuthService) {

    this.isScoreLoaded = false;

    if (auth.isLoggedIn()) {
      this.isMenSelected = auth.player.isMale;
    } else {
      this.isMenSelected = false;
    }

    var date = new Date();
    this.yearNow = date.getFullYear();

    this.years = new Array();
    for (var i = 2016; i <= this.yearNow; i++) {
      this.years.push(i);
    }

    this.selectedYear = this.yearNow;
    this.loadScores(this.selectedYear, this.isMenSelected);
  }

  loadScores(year: number, isMen: boolean) {

    this.selectedYear = year;
    this.isMenSelected = isMen;

    this.isScoreLoaded = false;

    if (!isMen) {
      this.data.getTournamentPlayersScoresByTypeAndYear(0x02, year).subscribe((s: any) => {
        this.scores = s;
        this.isScoreLoaded = true;
      });
    }
    else {
      this.data.getTournamentPlayersScoresByTypeAndYear(0x01, year).subscribe((s: any) => {
        this.scores = s;
        this.isScoreLoaded = true;
      });
    }
  }

  ngOnInit() {
  }

}


