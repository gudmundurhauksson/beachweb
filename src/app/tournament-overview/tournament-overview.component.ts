import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { Tournament } from '../models/tournament';
import { Division } from '../models/division';
import { DivisionMatch } from '../models/divisionMatch';
import { GroupModel } from '../models/groupModel';
import { SimpleDivisionMatch } from '../models/simpleDivisionMatch';
import { AuthService } from '../auth.service';
import { SimpleDivisionMatchResult } from '../models/simpleDivisionMatchResult';
import { DivisionGroupTable, DivisionGroupEntry } from '../models/divisionGroupTable';
import { Support } from '../models/support';
import { DivisionAndGroup } from '../models/divisionAndGroup';

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
  public matchesInGroup: SimpleDivisionMatch[];
  public table: DivisionGroupTable;
  public isWaiting: boolean;

  constructor(private route: ActivatedRoute, private data: DataService, private auth: AuthService, private router: Router) {
    this.tournament = null;
    this.divisions = new Array();
    this.typeSelected = -1;
    this.selectedDivision = null;
    this.selectedGroup = null;
    this.matchesInGroup = new Array();
    this.table = null;
    this.isWaiting = false;

    this.route.params.subscribe((res: any) => {
      var tournamentId = res.id;

      this.data.getTournament(tournamentId).subscribe((s: any) => {
        this.tournament = <Tournament>s;

        if (res.type != null) {
          var division = -1;
          var divisionGroup = -1;

          if (res.division != null) {
            division = res.division;
          }

          if (res.divisionGroup != null) {
            divisionGroup = res.divisionGroup;
          }

          this.loadDivisions(res.type, division, divisionGroup);
        }
        else if(this.auth.isLoggedIn()) {
          // Load what the player is registered in
          this.data.getPlayerDivisionAndGroup(this.auth.player.id, this.tournament.id).subscribe((s:any) => {
            var divisionAndGroup = <DivisionAndGroup>s;

            if (divisionAndGroup.division >= 0 && divisionAndGroup.divisionGroup >= 0) {
              this.loadDivisions(divisionAndGroup.type, divisionAndGroup.division, divisionAndGroup.divisionGroup);
            }
          });
        }

      });

    });
  }

  isTournament(type: number) {
    if (this.tournament == null) {
      return false;
    }

    return (type & this.tournament.type) > 0;
  }

  loadDivisions(type: number, division: number, divisionGroup: number) {
    this.typeSelected = type;
    this.selectedDivision = null;
    this.selectedGroup = null;
    this.divisions = new Array();
    this.matchesInGroup = new Array();
    this.table = null;

    this.isWaiting = true;
    this.data.getDivisions(this.tournament.id, type).subscribe((s: any) => {
      this.divisions = <Division[]>s;
      this.isWaiting = false;

      if (division > -1) {
        this.selectedDivision = this.getDivision(division);
      }

      if (divisionGroup > -1) {
        this.selectedGroup = this.getDivisionGroup(divisionGroup);
      }

      if (this.selectedDivision != null && this.selectedGroup != null) {
        this.loadDivisionGroup(this.selectedDivision, this.selectedGroup);
      }
    });
  }

  private loadDivisionTable(division: Division, group: GroupModel) {
    this.data.getDivisionGroupTable(this.tournament.id, this.typeSelected, division.division, group.divisionGroup).subscribe((s: any) => {
      this.table = <DivisionGroupTable>s;
    });
  }

  private getDivision(division: number) {
    for (var i = 0; i < this.divisions.length; i++) {
      if (this.divisions[i].division == division) {
        return this.divisions[i];
      }
    }

    return null;
  }

  private getDivisionGroup(divisionGroup: number) {
    for (var i = 0; i < this.selectedDivision.groups.length; i++) {
      if (this.selectedDivision.groups[i].divisionGroup == divisionGroup) {
        return this.selectedDivision.groups[i];
      }
    }

    return null;
  }

  loadDivisionGroup(division: Division, group: GroupModel) {
    this.selectedDivision = division;
    this.selectedGroup = group;
    this.matchesInGroup = new Array();

    this.loadDivisionTable(this.selectedDivision, this.selectedGroup);

    this.isWaiting = true;
    this.data.getSimpleDivisionMatches(this.tournament.id, this.typeSelected, this.selectedDivision.division, this.selectedGroup.divisionGroup).subscribe((s: any) => {
      this.matchesInGroup = <SimpleDivisionMatch[]>s;
      this.isWaiting = false;

      for (var i = 0; i < this.matchesInGroup.length; i++) {
        this.loadResults(this.matchesInGroup[i]);
      }
    });
  }

  loadResults(match: SimpleDivisionMatch) {
    this.isWaiting = true;
    this.data.getMatchResult(match.round, match.team1Id, match.team2Id).subscribe((s: any) => {
      this.isWaiting = false;
      match.results = <SimpleDivisionMatchResult[]>s;
    });
  }

  getMatchResults(match: SimpleDivisionMatch) {
    var result: string;
    var hasResults: boolean;
    hasResults = false;
    result = "(";
    if (match != null && match.results != null) {
      for (var i = 0; i < match.results.length; i++) {
        var res = match.results[i];
        if (res.complete) {
          hasResults = true;
          result += res.team1Score + ":" + res.team2Score + ",";
        }
      }
    }

    result = result.slice(0, -1);
    result += ")";

    if (!hasResults) {
      return "";
    }

    return result;
  }  

  isAdmin() {
    if (!this.auth.isLoggedIn()) {
      return false;
    }

    return this.auth.player.isAdmin;
  }

  isAdminViewer() {
    if (!this.auth.isLoggedIn()) {
      return false;
    }

    return this.auth.player.isAdminViewer || this.auth.player.isAdmin;
  }

  enterResults(match: SimpleDivisionMatch) {
    this.router.navigate(['/enter-results/' + match.tournamentId + "/" + match.teamTypeId + "/" + match.division + "/" + match.divisionGroup + "/" + match.round + "/" + match.team1Id + "/" + match.team2Id]);
  }

  ngOnInit() {
  }

  formatRatio(ratio: number) {
    if (ratio == -1) {
      return "-";
    }

    return ratio.toFixed(2);
  }

  editSupport(match: SimpleDivisionMatch) {
    match.isEditing = true;
    match.supportEdit = match.support;
  }

  confirmSupport(match: SimpleDivisionMatch) {
    var support = new Support();
    support.support = match.supportEdit;
    this.data.assignMatchSupport(match, support).subscribe((s: any) => {
      var result = <Support>s;
      match.support = result.support;
      match.isEditing = false;
    });
  }

  resolveTeams(match: SimpleDivisionMatch) {
    this.data.resolveMatchTeams(match).subscribe(s=> {
      this.loadDivisionGroup(this.selectedDivision, this.selectedGroup);
    });
  }

  resetTeams(match: SimpleDivisionMatch) {
    this.data.resetMatchTeams(match).subscribe(s=> {
      this.loadDivisionGroup(this.selectedDivision, this.selectedGroup);
    });
  }

  saveFinalPoints(finalEntries: DivisionGroupEntry[]) {
    this.data.saveFinalTable(finalEntries).subscribe(s =>  {

    });
  }
}
