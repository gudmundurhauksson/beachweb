import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-arrange-matches',
  templateUrl: './arrange-matches.component.html',
  styleUrls: ['./arrange-matches.component.scss']
})
export class ArrangeMatchesComponent implements OnInit {

  private division: number;
  private tournament: number;

  constructor(private data: DataService, private auth: AuthService, private route: ActivatedRoute) {
    this.route.params.subscribe((res: any) => {      
      this.division = res.division;
      this.tournament = res.tournament;

      console.log(this.division);
      console.log(this.tournament);
      });
   }

  ngOnInit() {
  }

}
