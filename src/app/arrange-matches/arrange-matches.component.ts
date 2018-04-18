import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { GroupModel } from '../models/groupModel';
import { Registration } from '../models/registration';
import { Subscription } from 'rxjs';
import { Match } from '../models/match';

@Component({
  selector: 'app-arrange-matches',
  templateUrl: './arrange-matches.component.html',
  styleUrls: ['./arrange-matches.component.scss']
})
export class ArrangeMatchesComponent implements OnInit {

  private division: number;
  private tournamentId: number;
  private teamType: number;
  private registrations: Registration[];
  public matchFetchCount: number;
  public groups: GroupModel[];

  constructor(private data: DataService, private auth: AuthService, private route: ActivatedRoute) {
    this.matchFetchCount = -1;
    this.registrations = null;
    this.groups = null;
    this.route.params.subscribe((res: any) => {
      this.division = res.division;
      this.tournamentId = res.tournamentId;
      this.teamType = res.type;

      console.log(this.division);
      console.log(this.tournamentId);

      this.data.getRegistration(this.tournamentId, this.teamType).subscribe((s: any) => {
        this.registrations = <Registration[]>s;
      });
    });
  }

  ngOnInit() {
  }

  loaded() : boolean {
    return this.registrations != null && this.registrations.length > 0 && this.groups != null && this.groups.length > 0;
  }

  confirm() {
    
  }

  update(groupRule: number) {
    console.log('Selected: ' + groupRule);
    this.data.getGroups(this.tournamentId, this.teamType, this.division, groupRule).subscribe((s: any) => {
      var groups = <GroupModel[]>s;
      this.groups = groups;
    });
  }

  getRemainingGroups(group: GroupModel) : GroupModel[]  {
    var models: Array<GroupModel>;
    models = new Array<GroupModel>();

    console.log('calculating ...');

    for (var i = 0; i < this.groups.length; i++) {      
      if(this.groups[i].name == group.name) {        
        continue;
      }

      models.push(this.groups[i]);
    }

    return models;
  }

  getTeamRegistration(teamId: number) : Registration {
    for (var i = 0; i < this.registrations.length; i++) {
      if (this.registrations[i].teamId == teamId) {
        return this.registrations[i];
      }
    }

    return null;
  }

  change(teamId: number, currentGroup: GroupModel, newGroup: GroupModel) : void {
    var index = currentGroup.teamIds.indexOf(teamId);
    currentGroup.teamIds.splice(index, 1);
    newGroup.teamIds.push(teamId);
  }  

  calculateMatches() : void {
    this.matchFetchCount = this.groups.length;
    
    for (var i = 0; i < this.groups.length; i++) {
      var group = this.groups[i];
      this.loadMatches(group);
    }
  }

  private loadMatches(group: GroupModel) {
    this.data.getMatches(group).subscribe((s:any) => {
      var matches = <Match[]>s;
      group.matches = matches;
      this.matchFetchCount--;
    });
  }
  

}
