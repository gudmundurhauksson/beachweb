import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Player } from '../models/player';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.scss']
})

export class NewuserComponent implements OnInit {
  confirm: string;
  gender: number;

  public player: Player;

  constructor(private _data : DataService) { 
    this.gender = 0;
    this.player = new Player();
  }

  ngOnInit() {
  }

  onChangeName(name: string) {
    if (name == null ||name.length == 0) {
      return;
    }

    if(name.indexOf("son") >= 0) {
      this.gender = 1;
    } else if (name.indexOf("dóttir") >= 0) {
      this.gender = 0;
    }

    console.log("changed name");
  }

  register() {
    
    if(this.player.id == null) {
      console.log("Error: id must be supplied");
      return;
    }

    var idLen = this.player.id.length;
    if(!(idLen == 10 ||idLen == 11)) {
      console.log("invalid id length");
      return;
    }
    
    if (this.player.email == null || this.player.email.length == 0) {
      console.log("Error: Email must be supplied");
      return;
    }

    if(this.player.password == null || this.player.password.length == 0) {
      console.log("Error: password must be supplied");
      return;
    }

    if(this.player.password != this.confirm)  {
        console.log("Error: Passwords do not match!");
        return;
    }



    // Create user 
    this._data.register(this.player).subscribe(data => {      

      console.log(data);
      //console.log("logging: " + m.statusText);
    }, err => {
      console.log("Got error");
      console.log(err);
    });    
  }
}
