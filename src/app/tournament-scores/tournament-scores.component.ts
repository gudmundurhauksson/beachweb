import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { ScoresModel } from '../models/scoresmodel';
import { TournamentScore } from '../models/tournamentScore';

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

  constructor(private route: ActivatedRoute, private data: DataService) {

    this.isWomenScoreLoaded = false;
    this.isMenScoreLoaded = false;

    this.route.params.subscribe((res: any) => {
      var year = res.year;
      console.log(year);

      data.getTournamentPlayersScoresByTypeAndYear(0x02, year).subscribe((s: any) => {
        this.womenScores = s;
        this.isWomenScoreLoaded = true;
      });

      data.getTournamentPlayersScoresByTypeAndYear(0x01, year).subscribe((s: any) => {
        this.mensScores = s;
        this.isMenScoreLoaded = true;
      });

    });

  }

  ngOnInit() {
  }

}


