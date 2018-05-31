import { Component, OnInit, TemplateRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { GroupModel } from '../models/groupModel';
import { Registration } from '../models/registration';
import { Subscription } from 'rxjs/Subscription';
import { Match } from '../models/match';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DivisionMatch } from '../models/divisionMatch';

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
  public finals: DivisionMatch[];
  public isFinalsDecided : boolean;
  public groupRule: number;
  public modalRef: BsModalRef; // {1}  

  constructor(private data: DataService, private auth: AuthService, private route: ActivatedRoute, private router: Router, private modalService: BsModalService) {

    this.groupRule = 0;
    this.matchFetchCount = -1;
    this.registrations = null;
    this.groups = null;
    this.isFinalsDecided = false;
    this.finals = null;

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
    this.data.confirmMatchList(this.groups, this.finals).subscribe(s => {
      this.router.navigate(['/admin-all-registrations/' + this.tournamentId]);
    }, error => {
      console.log(error);
    });
  }

  update(groupRule: number) {
    this.isFinalsDecided = false;
    this.groupRule = groupRule;
    this.groups = null;
    this.matchFetchCount = -1;
    this.finals = null;

    console.log('Selected: ' + groupRule);
    this.data.getGroups(this.tournamentId, this.teamType, this.division, groupRule).subscribe((s: any) => {
      var groups = <GroupModel[]>s;
      this.groups = groups;
    });
  }

  updateFinals(finalsGroupRule: number) {
    this.isFinalsDecided = false;
    this.data.getFinals(this.tournamentId, this.teamType, this.division, this.groupRule, finalsGroupRule).subscribe((s: any) =>{
      this.finals = <DivisionMatch[]>s;
      this.isFinalsDecided = true;
    },  error => {
      this.showMessage("Villa", "Of fá lið í kross.");
    });
  }

  getRemainingGroups(group: GroupModel) : GroupModel[]  {
    var models: Array<GroupModel>;
    models = new Array<GroupModel>();

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

      if (this.groupRule == 2) {
        this.isFinalsDecided = true;
      }
    } 
  }

  getTeams(group: GroupModel) {
    var teams: Registration[];
    teams = new Array();

    for (var i = 0; i < group.teamIds.length; i++) {
      teams.push(this.getTeamRegistration(group.teamIds[i]));
    }

    teams.sort(function(a,b) {
      return b.totalTeamPoints - a.totalTeamPoints;
    });

    return teams;
  }

  private loadMatches(group: GroupModel) {
    this.data.calculateMatches(group).subscribe((s:any) => {
      var matches = <Match[]>s;
      group.matches = matches;
      this.matchFetchCount--;
    }, error => {
      this.showMessage("Villa", "Of margir leikir í deild eða of fá lið í kross.");
    });
  }
  
  public modalHeader: string;
  public modalBody: string;

  showMessage(header: string, body: string) {
    this.modalHeader = header;
    this.modalBody = body;
    document.getElementById("openMessageButton").click();
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template); // {3}
  }

}
