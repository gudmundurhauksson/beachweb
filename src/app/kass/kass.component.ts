import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '../data.service';
import { SimpleTimer } from 'ng2-simple-timer';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-kass',
  templateUrl: './kass.component.html',
  styleUrls: ['./kass.component.scss']
})
export class KassComponent implements OnInit {

  public gsm : string;
  private teamId : number;
  private timerCount: number;
  private isWaiting: boolean;
  private isVerifying: boolean;
  public modalRef: BsModalRef; // {1}
  private timerName: string;
  private timerId: string;

  constructor(private _auth : AuthService, 
    private router : Router, 
    private location : Location, 
    private _data : DataService, 
    private route: ActivatedRoute,
    private timer: SimpleTimer,
    private modalService: BsModalService) { 
    
    this.timerName ="WaitForKassTimer";
    this.isWaiting = false;
    this.timerCount = 90;  

    if (!_auth.isLoggedIn() || _auth.player == null) {
      this.router.navigate([this.location.path().replace('kass', '')]);
      return;
    }

    this.route.params.subscribe(res => this.teamId = res.id);
    _data.canPay(this.teamId, _auth.player.id).subscribe(s => {
    }, error => {
      //this.router.navigate(['/login']);
    });

    this.gsm = _auth.player.mobile;
  }

  send() : void {
    // this._data.sendKassRequest(this.gsm);

    if (this.gsm == null || this.gsm.length != 7) {
      this.showMessage("Villa", "Vinsamlegast sláið inn gilt símanúmer");
      return;
    }

    this.isWaiting = true;    
    this.timer.newTimer(this.timerName, 1)
    this.timerCount = 90;
    this.timerId = this.timer.subscribe(this.timerName, () => {
      this.timerTick();
    });
  }

  private timerTick() {

    console.log(this.timer.getSubscription());

    this.timerCount--;            

    if (this.timerCount <= 0) {
      this.timerCount = 0;

      this.timer.unsubscribe(this.timerId);
      this.showMessage("Villa", "Greiðsla barst ekki. Vinsamlegast reynið aftur.");
      this.router.navigate([this.location.path().replace('kass', '')]);
      return;
    }

    if (this.isVerifying) {
      return;
    }

    this.isVerifying = true;
    this._data.verifyPayment(this.teamId).subscribe(s => {
      
      this.timer.unsubscribe(this.timerId);
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

  ngOnInit() {
  }

}
