import { Component, OnInit, TemplateRef } from '@angular/core';
import { DataService } from '../data.service';
import { Player } from '../models/player';
import { AuthService } from '../auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public modalRef: BsModalRef; // {1}

  public player: Player;
  public isWaiting: boolean;

  constructor(private data: DataService, private auth: AuthService, private modalService: BsModalService, private router : Router) {
    this.player = new Player();
    this.isWaiting = false;
  }

  ngOnInit() {

  }

  login() {
    
    this.isWaiting = true;
    this.auth.login(this.player).subscribe((s: number) => {
      this.isWaiting = false;
      if (s == 0) {       
        this.showMessage("Villa!", "Þjónustan svarar ekki. Vinsamlegast reynið síðar.");
      } else if (s==200) {
        // success
        // navigate?
      } else if (s== 400) {        
        this.showMessage("Villa!", "Rangt notendanafn eða lykilorð.");        
      }
    }, error => {
      this.isWaiting = false;
    });
  }

  register() {
    this.router.navigate(['/newuser']);
  }

  forgotPassword() {
    this.router.navigate(['/forgotpassword']);
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
