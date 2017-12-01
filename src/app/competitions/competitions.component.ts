import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.scss']
})

export class CompetitionsComponent implements OnInit {

  year: any;

  constructor(private route: ActivatedRoute, private router: Router, private _data: DataService) {
    this.route.params.subscribe(
      res => this.year = res.id
    );    
 }

  ngOnInit() {
  }

}
