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

  constructor(private data: DataService, private _auth: AuthService, private modalService: BsModalService, private router : Router) {
    this.player = new Player();
  }

  ngOnInit() {

  }

  login() {
    console.log('logging in');
    this._auth.login(this.player).subscribe((s: number) => {
      console.log("S=" + s);
      console.log(s == 0);
      if (s == 0) {       
        this.showMessage("Villa!", "Þjónustan svarar ekki. Vinsamlegast reynið síðar.");
      } else if (s==200) {
        // success
        // navigate?
      } else if (s== 400) {        
        this.showMessage("Villa!", "Rangt notendanafn eða lykilorð.");
      }
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
