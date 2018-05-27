import { Component, OnInit, TemplateRef } from '@angular/core';
import { DataService } from '../data.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PaymentStatus } from '../models/registration';

@Component({
  selector: 'app-aur',
  templateUrl: './aur.component.html',
  styleUrls: ['./aur.component.scss']
})
export class AurComponent implements OnInit {

  public gsm : string;
  private teamId : number;
  private timerCount: number;
  public isWaiting: boolean;
  private isVerifying: boolean;
  public modalRef: BsModalRef; // {1}
  private timerName: string;
  private timerId: string;

  constructor(private auth : AuthService, 
    private router : Router, 
    private location : Location, 
    private data : DataService, 
    private route: ActivatedRoute,
    // private timer: SimpleTimer,
    private modalService: BsModalService) { 
    
    this.timerName ="WaitForAurTimer";
    this.isWaiting = false;
    this.timerCount = 90;  

    if (!auth.isLoggedIn() || auth.player == null) {
      this.router.navigate([this.location.path().replace('aur', '')]);
      return;
    }

    this.route.params.subscribe(res => this.teamId = res.id);
    data.canPay(this.teamId, auth.player.id).subscribe(s => {
    }, error => {
      //this.router.navigate(['/login']);
    });

    this.gsm = auth.player.mobile;
  }

  send() : void {
    
    if (this.gsm == null || this.gsm.length != 7) {
      this.showMessage("Villa", "Vinsamlegast sláið inn gilt símanúmer");
      return;
    }

    this.isWaiting = true;    
    console.log("sending aur");
    this.data.sendAurRequest(this.gsm, this.teamId).subscribe(s=> {      
    }, error => {
      console.log(error);
      this.showMessage("Villa", "Óþekkt villa. Vinsamlegast reynið síðar");
      this.isWaiting = false;
    });
    
    //this.timer.newTimer(this.timerName, 1)
    //this.timerCount = 90;
    //this.timerId = this.timer.subscribe(this.timerName, () => {
    //  this.timerTick();
    //});
  }

  private timerTick() {

    // console.log(this.timer.getSubscription());

    this.timerCount--;            

    if (this.timerCount <= 0) {
      this.timerCount = 0;

      // this.timer.unsubscribe(this.timerId);
      this.showMessage("Villa", "Greiðsla barst ekki. Vinsamlegast reynið aftur.");
      this.router.navigate([this.location.path().replace('aur', '')]);
      return;
    }

    if (this.isVerifying) {
      return;
    }

    this.isVerifying = true;
    this.data.verifyPayment(this.teamId).subscribe(s => {
      
      // this.timer.unsubscribe(this.timerId);
      this.isVerifying = false;

      // success!! 
      this.showMessage("Aðgerð lokið", "Greiðsla tókst.");
      this.router.navigate(['/my-tournaments']);
      return;

    }, error => {
      this.isVerifying = false;
      console.log("error");
    });
  }

  public modalHeader: string;
  public modalBody: string;

  showMessage(header: string, body: string) {
    this.modalHeader = header;
    this.modalBody = body;
    document.getElementById("openMessageButton").click();
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template); // {3}
  }

  refresh() {
    this.data.refreshPaymentStatus(this.teamId).subscribe((s: any) => {
      var status = <PaymentStatus>s;
      if (status.isPaid) {
        this.showMessage('Aðgerð tókst', 'Greiðsla var móttekin.');
        this.router.navigate(['my-tournaments']);
        return;
      } else {
        this.showMessage('Vinsamlegast bíðið ...', 'Greiðsla hefur ekki borist. Vinsamlegast bíðið augnablik og reynið aftur.');
      }
    });
  }

  ngOnInit() {
  }
}
