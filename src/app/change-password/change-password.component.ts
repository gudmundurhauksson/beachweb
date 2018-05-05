import { Component, OnInit, TemplateRef } from '@angular/core';
import { Player } from '../models/player';
import { DataService } from '../data.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public player: Player;
  public confirm: string;
  public modalRef: BsModalRef; // {1}

  constructor(private data: DataService, private modalService: BsModalService, private router: Router) {
    this.player = new Player();
   }

  ngOnInit() {
  }

  changePassword() : void { 

    console.log("change password");

    if(this.player.password != this.confirm) {
      this.showMessage("Villa", "Lykilorð eru ekki eins!");
      return;
    }

    if (this.player.password == null || this.player.password.length < 4) {
      this.showMessage("Villa", "Lykilorð þarf að vera a.m.k. 4 stafir");
      return;
    }

    this.data.changePassword(this.player.password).subscribe(s => {
        this.showMessage("Aðgerð tókst", "Lykilorði var breytt.");
        this.router.navigate(['/']);
    }, err=> {
        
      this.showMessage("Villa", "Aðgerð mistókst.");
        console.log(err);
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

}
