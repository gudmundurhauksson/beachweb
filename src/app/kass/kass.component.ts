import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '../data.service';

@Component({
  selector: 'app-kass',
  templateUrl: './kass.component.html',
  styleUrls: ['./kass.component.scss']
})
export class KassComponent implements OnInit {

  public gsm : string;

  constructor(private _auth : AuthService, private router : Router, private location : Location, private _data : DataService) { 

    if (_auth.player == null) {
      this.router.navigate([this.location.path().replace('kass', '')]);
      return;
    }

    this.gsm = _auth.player.mobile;
  }

  send() : void {
    this._data.sendKassRequest(this.gsm);
  }

  ngOnInit() {
  }

}
