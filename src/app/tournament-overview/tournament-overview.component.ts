import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { Tournament } from '../models/tournament';
import { Division } from '../models/division';
import { DivisionMatch } from '../models/divisionMatch';
import { GroupModel } from '../models/groupModel';

@Component({
  selector: 'app-tournament-overview',
  templateUrl: './tournament-overview.component.html',
  styleUrls: ['./tournament-overview.component.scss']
})
export class TournamentOverviewComponent implements OnInit {

  public tournament: Tournament;
  public divisions: Division[];
  public typeSelected: number;
  public selectedDivision: Division;
  public selectedGroup: GroupModel;

  constructor(private route: ActivatedRoute, private data: DataService) {
    this.tournament = null;
    this.divisions = new Array();
    this.typeSelected = -1;
    this.selectedDivision = null;
    this.selectedGroup = null;

    this.route.params.subscribe((res: any) => {
      var tournamentId = res.id;

      console.log(tournamentId);

      this.data.getTournament(tournamentId).subscribe((s: any) => {
        this.tournament = <Tournament>s;
      });

    });
  }

  isTournament(type: number) {
    if (this.tournament == null) {
      return false;
    }

    return (type | 0x02) > 0;
  }

  loadDivisions(type: number) {
    this.typeSelected  = type;
    this.selectedDivision = null;
    this.selectedGroup = null;
    this.divisions = new Array();

    this.data.getDivisions(this.tournament.id, type).subscribe((s : any) => {
      this.divisions = <Division[]>s;
    });
  }

  loadDivisionGroup(division: Division, group: GroupModel) {
    this.selectedDivision = division;
    this.selectedGroup = group;
  }

  ngOnInit() {
  }

}
