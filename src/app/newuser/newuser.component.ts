import { Component, OnInit, TemplateRef } from '@angular/core';
import { DataService } from '../data.service';
import { Player } from '../models/player';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.scss']
})

export class NewuserComponent implements OnInit {
  confirm: string;
  gender: number;
  public isWaiting : boolean;

  /* Used when creating new user while registering for a tournament */
  navigateBack: boolean;

  public player: Player;
  public modalRef: BsModalRef;

  constructor(private data: DataService,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: BsModalService,
    private router: Router) {
    this.gender = 0;
    this.player = new Player();
    this.isWaiting = false;

    this.navigateBack = false;

    this.route.params.subscribe((res: any) => {
      if (res.id != null && res.id.length > 0) {
        this.navigateBack = true;
      }
      console.log(res);
      this.player.id = res.id
    });
  }

  ngOnInit() {
  }

  onChangeName(name: string) {
    if (name == null || name.length == 0) {
      return;
    }

    if (name.indexOf("son") >= 0) {
      this.gender = 1;
    } else if (name.indexOf("dóttir") >= 0) {
      this.gender = 0;
    }

    console.log("changed name");
  }

  register() {

    if (this.player.id == null) {
      this.showMessage("Villa", "Vinsamlegast sláið inn kennitölu!")
      return;
    }

    var idLen = this.player.id.length;
    if (!(idLen == 10 || idLen == 11)) {
      this.showMessage("Villa", "Vinsamlegast sláið inn kennitölu!")
      return;
    }

    if (this.player.name == null || this.player.name.length < 5) {
      this.showMessage("Villa", "Vinsamlegast sláið inn nafn!")
      return;
    }

    if (this.player.email == null || this.player.email.length == 0) {
      this.showMessage("Villa", "Vinsamlegast sláið inn netfang!")
      return;
    }

    if (this.player.password == null || this.player.password.length == 0) {
      this.showMessage("Villa", "Vinsamlegast sláið inn lykilorð!")
      return;
    }

    if (this.player.password != this.confirm) {
      this.showMessage("Villa", "Lykilorð eru ekki eins!")
      return;
    }

    this.player.isMale = (this.gender == 1);
    this.isWaiting = true;
    // Create user 
    this.data.register(this.player).subscribe(data => {
      this.isWaiting = false;      
      if (this.navigateBack) {
        // User was being registered to a tournament
        this.location.back();
      } else {
        this.showMessage("Aðgerð tókst", "Skráning leikmanns tókst.");
        this.router.navigate(['/login']);
      }
    }, err => {

      this.isWaiting = false;
      console.log(err);

      if (err.status == 0) {
        this.showMessage("Villa", "Bakendi svarar ekki!");
        return;
      }

      if (err.status == 409) {
        this.showMessage("Villa", "Leikmaður þegar skráður!");
        return;
      }

      var errorMessage = err.json().message;
      if (errorMessage == "EMAIL_ERROR") {
        this.showMessage("Villa", "Ógilt netfang!")
      } else if (errorMessage == "ID_ERROR") {
        this.showMessage("Villa", "Ógild kennitala!")
      } else if (errorMessage == "NAME_ERROR") {
        this.showMessage("Villa", "Of stutt nafn!")
      } else if (errorMessage == "PASSWORD_ERROR") {
        this.showMessage("Villa", "Of stutt lykilorð!")
      } else {
        this.showMessage("Óþekkt villa", errorMessage);
      }
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
