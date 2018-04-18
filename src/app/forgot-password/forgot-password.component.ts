import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Player } from '../models/player';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public player: Player;
  public modalRef: BsModalRef; // {1}

  constructor(private data : DataService, private router: Router, private modalService: BsModalService) {
    this.player = new Player();
   }

  reset() {
    if (this.player.id == null ||this.player.id.length < 10 || this.player.id.length > 12) {
      this.showMessage('Villa', 'Vinsamlegast sláið inn kennitölu');
      return;
    }

    this.data.requestPasswordReset(this.player.id).subscribe(s => {
      this.router.navigate(['/login']);

      this.showMessage("Sending tókst", "Leiðbeiningar hafa verið sendar í tölvupósti");

      return;
    }, error => {
      var json = error.json().message;

      if (json == "PLAYER_NOT_FOUND") {
        this.showMessage("Villa", "Leikmaður fannst ekki. Vinsamlegast skráðu nýjan leikmann.");
        return;
      } else if (json == "PLAYER_NOT_REGISTERED") {
        this.showMessage("Villa", "Leikmaður fannst ekki. Vinsamlegast skráðu nýjan leikmann.");        
        return;
      } else if (json == "EMAIL_ERROR") { 
        this.showMessage("Villa", "Sending tölvupósts mistókst. Vinsamlegast hafið samband við bli.strandblak@gmail.com");
        return;
      } else if (json == "ID_ERROR") {
        this.showMessage("Villa", "Ógild kennitala!")
        return;
      } else {
        this.showMessage("Villa", "Óþekkt villa. Vinsamlegast reynið síðar.");
        return;
      }
      
    });
  }

  ngOnInit() {
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
