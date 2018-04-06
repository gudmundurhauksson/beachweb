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

  public womenScores: TournamentScore[];
  public mensScores: TournamentScore[];

  public isWomenScoreLoaded: boolean;
  public isMenScoreLoaded: boolean;

  public yearNow: number;
  public years: number[];
  public selectedYear: number;
  public isMenSelected: boolean;

  constructor(private data: DataService, private auth: AuthService) {

    this.isWomenScoreLoaded = false;
    this.isMenScoreLoaded = false;    

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

    this.isMenScoreLoaded = false;
    this.isWomenScoreLoaded = false;

    if (!isMen) {
      this.data.getTournamentPlayersScoresByTypeAndYear(0x02, year).subscribe((s: any) => {
        this.womenScores = s;
        this.isWomenScoreLoaded = true;
      });
    }
    else {
      this.data.getTournamentPlayersScoresByTypeAndYear(0x01, year).subscribe((s: any) => {
        this.mensScores = s;
        this.isMenScoreLoaded = true;
      });
    }
  }

  ngOnInit() {
  }

}


