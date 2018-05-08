import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { SimpleDivisionMatchResult } from '../models/simpleDivisionMatchResult';
import { Team, SimpleTeam } from '../models/team';

@Component({
  selector: 'app-enter-match-result',
  templateUrl: './enter-match-result.component.html',
  styleUrls: ['./enter-match-result.component.scss']
})
export class EnterMatchResultComponent implements OnInit {

  private tournamentId: number;
  private teamTypeId: number;
  private division: number;
  private divisionGroup: number;
  private round: number;
  private team1Id: number;
  private team2Id: number;
  public setResults: SimpleDivisionMatchResult[];

  public team1: SimpleTeam;
  public team2: SimpleTeam;

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService, private auth: AuthService) {
    this.setResults = new Array();

    this.team1 = null;
    this.team2 = null;

    this.route.params.subscribe((res: any) => {
      this.tournamentId = res.tournamentId;
      this.teamTypeId = res.teamTypeId;
      this.division = res.division;
      this.divisionGroup = res.divisionGroup;
      this.round = res.round;
      this.team1Id = res.team1Id;
      this.team2Id = res.team2Id;

      this.data.getTeamById(this.team1Id).subscribe((s: any) => {
        this.team1 = <SimpleTeam>s;
      });

      this.data.getTeamById(this.team2Id).subscribe((s: any) => {
        this.team2 = <SimpleTeam>s;
      });

      this.data.getMatchResult(this.round, this.team1Id, this.team2Id).subscribe((s: any) => {
        this.setResults = <SimpleDivisionMatchResult[]>s;
      });
    });
  }

  sendResults(resultSet: SimpleDivisionMatchResult) {
    this.data.sendResults(this.round, resultSet).subscribe(s=> {

    });
  }

  navigateBack() {
    this.router.navigate(['/tournaments/' + this.tournamentId + "/" + this.teamTypeId + "/" + this.division + "/" + this.divisionGroup]);
  }

  ngOnInit() {
  }

}
