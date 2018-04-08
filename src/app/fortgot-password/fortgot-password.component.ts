import { Component, OnInit } from '@angular/core';
import { Player } from '../models/player';

@Component({
  selector: 'app-fortgot-password',
  templateUrl: './fortgot-password.component.html',
  styleUrls: ['./fortgot-password.component.scss']
})
export class FortgotPasswordComponent implements OnInit {

  public player: Player;

  constructor() {
    this.player = new Player();
   }



  ngOnInit() {
  }

}
