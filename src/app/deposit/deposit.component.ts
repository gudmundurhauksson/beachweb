import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Tournament } from '../models/tournament';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from '../models/team';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {

  public teamId: number;
  public tournament: Tournament;

  constructor(private data: DataService, private route: ActivatedRoute, private router : Router) {

    this.tournament = new Tournament();

    this.route.params.subscribe(res => {
      this.teamId = res.id;
      this.data.getTeamById(this.teamId).subscribe((s: any) => {
        var team = <Team>s;
        this.data.getTournament(team.tournamentId).subscribe((t: any) => {
          this.tournament = <Tournament>t;
        });
      });
    });
  }

  paid() : void {
    this.data.sendDepositRequest(this.teamId).subscribe(s=> {
      this.router.navigate(['/my-tournaments']);
    });
  }

  ngOnInit() {
  }

}
