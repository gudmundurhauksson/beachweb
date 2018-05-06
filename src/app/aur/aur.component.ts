import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-aur',
  templateUrl: './aur.component.html',
  styleUrls: ['./aur.component.scss']
})
export class AurComponent implements OnInit {

  public gsm: string;  
  private isTimerRunning: boolean;

  constructor(private auth: AuthService, private router: Router, private location: Location, private data: DataService) {

    if (auth.player == null) {
      this.router.navigate([this.location.path().replace('kass', '')]);
      return;
    }

    this.gsm = auth.player.mobile;
  }

  send(): void {
    //this._data.sendAurRequest(this.gsm);
    

  }

  ngOnInit() {
  }

}
