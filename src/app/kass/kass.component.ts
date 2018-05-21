import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '../data.service';
// import { SimpleTimer } from 'ng2-simple-timer';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PaymentStatus } from '../models/registration';

@Component({
  selector: 'app-kass',
  templateUrl: './kass.component.html',
  styleUrls: ['./kass.component.scss']
})
export class KassComponent implements OnInit {

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
    
    this.timerName ="WaitForKassTimer";
    this.isWaiting = false;
    this.timerCount = 90;  

    if (!auth.isLoggedIn() || auth.player == null) {
      this.router.navigate([this.location.path().replace('kass', '')]);
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
    console.log("sending kass");
    this.data.sendKassRequest(this.gsm, this.teamId).subscribe(s=> {      
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
      this.router.navigate([this.location.path().replace('kass', '')]);
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
        this.showMessage('Aðgerð tókst', 'Greiðla var móttekin.');
        this.router.navigate(['my-tournaments']);
        return;
      } else {
        if (status.paymentStatus == "REJECTED") {
          this.showMessage('Hafnað', 'Greiðslu var hafnað!');
          this.router.navigate(['/payment/' + this.teamId]);
        } else {
          this.showMessage('Vinsamlegast bíðið ...', 'Greiðsla hefur ekki borist. Vinsamlegast bíðið augnablik og reynið aftur.');
        }
      }
    });
  }

  ngOnInit() {
  }

}
