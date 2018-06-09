import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { Tournament } from '../models/tournament';
import { RegisteredTeam } from '../models/registeredTeam';

@Component({
  selector: 'app-registrations',
  templateUrl: './registrations.component.html',
  styleUrls: ['./registrations.component.scss']
})
export class RegistrationsComponent implements OnInit {

  private tournamentId: number;
  private tournament : Tournament;
  public typeSelected : number;

  private registrations: RegisteredTeam[];

  constructor(private data: DataService, private auth: AuthService, private route: ActivatedRoute) { 

    this.registrations = new Array();

    this.route.params.subscribe((res: any) => {
      this.tournamentId = res.tournamentId;

      this.data.getTournament(this.tournamentId).subscribe((s:any) => {
        this.tournament = <Tournament>s;
      });
    });
  }

  ngOnInit() {
  }

  isTypeInTournament(type: number) {
    if (this.tournament == null) {
      return false;
    }

    return (this.tournament.type & type) > 0;
  }

  refresh(teamType: number) {
    this.data.getTeamRegistrations(this.tournamentId, teamType).subscribe((s: any) => {
      this.registrations = <RegisteredTeam[]>s;
      this.typeSelected = teamType;
    });
  }

  isAdmin(): boolean {
    if (!this.auth.isLoggedIn()) {
      return false;
    }
    
    return this.auth.player.isAdmin;
  }

  isAdminViewer(): boolean {
    if (!this.auth.isLoggedIn()) {
      return false;
    }

    return this.auth.player.isAdminViewer || this.auth.player.isAdmin;
  }  

}
