import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { ScoresModel } from '../models/scoresmodel';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})

export class ScoresComponent implements OnInit {

  public womenScores : ScoresModel[];
  public mensScores: ScoresModel[];

  constructor(private route: ActivatedRoute, private data : DataService, private auth : AuthService) {     

    this.route.params.subscribe((res: any) => {
      var year = res.year;
      console.log(year);
      data.getTotalPlayerScoresByTypeAndYear(0x02, year).subscribe((s: any) => {      
      this.womenScores = s;
    });

    data.getTotalPlayerScoresByTypeAndYear(0x01, year).subscribe((s:any) => {
      this.mensScores = s;
    });
  });
  }

  ngOnInit() {
  }

}
