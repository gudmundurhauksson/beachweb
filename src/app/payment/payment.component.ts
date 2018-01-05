import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {


  private teamId : number;

  constructor(private route: ActivatedRoute, private router: Router, private location: Location) {
    this.route.params.subscribe(res => this.teamId = res.id);
   }

  payKass() : void {          
    this.router.navigate([this.location.path() + "/kass"]);
  }

  payAur() : void {
    this.router.navigate([this.location.path() + "/aur"]);
  }

  ngOnInit() {
  }

}
