import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { Team } from '../models/team';
import { TemplateRef } from '@angular/core/src/linker/template_ref';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';
import { Comment } from '../models/comment';

@Component({
  selector: 'app-my-tournaments',
  templateUrl: './my-tournaments.component.html',
  styleUrls: ['./my-tournaments.component.scss']
})
export class MyTournamentsComponent implements OnInit {

  public teams: Team[];
  public modalRef: BsModalRef; // {1}
  public isWaiting : boolean;
  public isCancelling : boolean;

  constructor(private data: DataService, 
    private auth: AuthService,
    private modalService: BsModalService,
    private router : Router) {

    this.teams = null;
    this.isWaiting = false;
    this.isCancelling = false;

    this.getTeams();    
  }

  getTeams(): void {

    this.teams = null;
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    this.isWaiting = true;
    this.data.getTournamentsStatus(this.auth.player).subscribe((s: any) => {
      this.isWaiting = false;
      this.teams = <Team[]>s;

      for (var i = 0; i < this.teams.length; i++) {
        var comment = new Comment();
        comment.player = this.auth.player;
        comment.team = this.teams[i];
        this.teams[i].comment = comment;

        this.teams[i].comments = new Array();
        this.refreshComments(this.teams[i]);
      }

      console.log(this.teams);
    }, (err: any) => {
      this.isWaiting = false;
      console.log(err);
    });    
  }

  getTournamentType(team: Team) : string {
    if (team.teamTypeId == 0x01) {
      return "Karlar - Fullorðnir";
    } else if (team.teamTypeId == 0x02) {
      return "Konur - Fullorðnir";
    } else if (team.teamTypeId == 0x04)     {
      return "Karlar - Unglingar";
    }
    else if (team.teamTypeId == 0x08) {
      return "Konur - Unglingar";
    }
  }

  cancel(team: Team) : void {    
    this.showYesNo("Hætta við skráningu", "Ertu viss um að þú viljir hætta við skráningu?");
    this.selectedTeam = team;
  }

  confirmCancel() : void {
    this.modalRef.hide();
    console.log("Cancelling");
    this.isCancelling = true;

    this.data.cancelRegistration(this.selectedTeam.id).subscribe(s => {
      this.isCancelling = false;
      this.getTeams();
    }, (err: any) => {
      console.log(err);
      this.isCancelling = false;
    });
  }

  public modalHeader: string;
  public modalBody: string;
  public selectedTeam: Team;

  showMessage(header: string, body: string) {
    this.modalHeader = header;
    this.modalBody = body;
    document.getElementById("openMessageButton").click();
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template); // {3}
  }

  showYesNo(header: string, body: string) {
    this.modalHeader = header;
    this.modalBody = body;
    document.getElementById("openYesNoButton").click();
  }

  public pay(team: Team) : void {
    this.router.navigate(['/payment/' + team.id]);
  }


  public submitComment(team: Team) {
    console.log(team.comment);
    if (team.comment === undefined || team.comment == null || team.comment.text == null || team.comment.text.length == 0) {
      return;
    }

    console.log("Submitting comment for: " + team.id + "=" + team.comment);
    this.data.sendComment(team.id, team.comment).subscribe((s:any) => {
      this.refreshComments(team);
    });
  };

  refreshComments(team: Team) : void {
    this.data.getComments(team.id).subscribe((s:any) => {
      team.comments = <Comment[]>s;
    });
  }

  ngOnInit() {
  }

}
