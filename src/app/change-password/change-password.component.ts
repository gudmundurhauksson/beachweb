import { Component, OnInit } from '@angular/core';
import { Player } from '../models/player';
import { DataService } from '../data.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public player: Player;
  public confirm: string;

  constructor(private _data: DataService) {
    this.player = new Player();
   }

  ngOnInit() {
  }

  changePassword() : void { 

    console.log("change password");

    if(this.player.password != this.confirm) {
      console.log("Passwords to not match");
      return;
    }

    if (this.player.password == null || this.player.password.length == 0) {
      console.log("password too short");
      return;
    }

    this._data.changePassword(this.player.password).subscribe(s => {
        console.log("password changed");
    }, err=> {
        console.log("error");
    });
  }

}
