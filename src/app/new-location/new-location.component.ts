import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { BeachLocation } from '../models/beachlocation';

@Component({
  selector: 'app-new-location',
  templateUrl: './new-location.component.html',
  styleUrls: ['./new-location.component.scss']
})
export class NewLocationComponent implements OnInit {

  public location: BeachLocation;

  constructor(private data: DataService) {     
    this.location = new BeachLocation();
  }

  register() : void {
    this.data.registerLocation(this.location).subscribe(data => {      
            console.log(data);
            //console.log("logging: " + m.statusText);
          }, err => {
            console.log("Got error");
            console.log(err);
          });    
  }

  ngOnInit() {
  }

}
