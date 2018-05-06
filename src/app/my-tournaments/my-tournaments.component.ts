import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { Team } from '../models/team';
import { TemplateRef } from '@angular/core/src/linker/template_ref';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-tournaments',
  templateUrl: './my-tournaments.component.html',
  styleUrls: ['./my-tournaments.component.scss']
})
export class MyTournamentsComponent implements OnInit {

  public teams: Team[];
  public modalRef: BsModalRef; // {1}

  constructor(private data: DataService, 
    private auth: AuthService,
    private modalService: BsModalService,
    private router : Router) {

    this.fetching = false;
    this.teams = null;
  }

  private fetching: boolean;

  getTeams(): Team[] {

    if (this.fetching) {
      return null;
    }

    if (this.teams != null) {
      return this.teams;
    }

    if (this.auth.player == undefined || this.auth.player === undefined || this.auth.player == null) {
      return null;
    }

    this.fetching = true;

    this.data.getTournamentsStatus(this.auth.player).subscribe((s: any) => {
      this.teams = <Team[]>s;

      this.fetching = false;
    }, (err: any) => {
      console.log(err);

      this.fetching = false;
    });

    return null;
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

    this.data.cancelRegistration(this.selectedTeam.id).subscribe(s => {
      this.teams = null;
    }, (err: any) => {
      console.log(err);
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

  ngOnInit() {
  }

}
