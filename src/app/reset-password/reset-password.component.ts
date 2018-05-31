import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public modalRef: BsModalRef; // {1}

  constructor(private router: Router, private route: ActivatedRoute, private data: DataService, private modalService: BsModalService) { 
    this.route.params.subscribe((res: any) => {
      var requestId = res.requestId;

      this.data.resetPassword(requestId).subscribe(s => {
        this.showMessage("Sending tókst", "Lykilorð hefur verið sent í tölvupósti");
        this.router.navigate(['/login']);
        return;
      }, error => {
        var json = error.json().message;
  
        if (json == "PLAYER_NOT_FOUND") {
          this.showMessage("Villa", "Leikmaður fannst ekki. Vinsamlegast skráðu nýjan leikmann.");
          return;
        }
        else if (json == "PLAYER_NOT_REGISTERED") {
          this.showMessage("Villa", "Leikmaður fannst ekki. Vinsamlegast skráðu nýjan leikmann.");        
          return;
        } else if (json == "EMAIL_ERROR") { 
          this.showMessage("Villa", "Sending tölvupósts mistókst. Vinsamlegast hafið samband við bli.strandblak@gmail.com");
          return;
        } else {
          this.showMessage("Villa", "Óþekkt villa. Vinsamlegast reynið síðar.");
          return;
        }
        
      })
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
