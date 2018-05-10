import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {


  public teamId : number;

  constructor(private auth : AuthService, private route: ActivatedRoute, private router: Router, private location: Location) {
    this.route.params.subscribe(res => this.teamId = res.id);
    
    if (!auth.isLoggedIn() || auth.player == null) {
      this.router.navigate(['/login']);
      return;
    }
   }

  payKass() : void {          
    this.router.navigate([this.location.path() + "/kass"]);
  }

  payAur() : void {
    this.router.navigate([this.location.path() + "/aur"]);
  }

  payDeposit() : void {
    this.router.navigate([this.location.path() + "/deposit"]);
  }

  ngOnInit() {
  }

}
