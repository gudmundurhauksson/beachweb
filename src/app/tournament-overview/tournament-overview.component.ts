import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tournament-overview',
  templateUrl: './tournament-overview.component.html',
  styleUrls: ['./tournament-overview.component.scss']
})
export class TournamentOverviewComponent implements OnInit {


  constructor(private route: ActivatedRoute) { 
    this.route.params.subscribe((res: any) => {
      var tournamentId = res.id;

      console.log(tournamentId);
    });
  }

  ngOnInit() {
  }

}
