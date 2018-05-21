import { Component, OnInit, TemplateRef } from '@angular/core';
import { DataService } from '../data.service';
import { AuthData } from '../models/authdata';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { registerLocaleData } from '@angular/common/src/i18n/locale_data';
import { Registration, PaymentStatus } from '../models/registration';
import { isEmbeddedView } from '@angular/core/src/view/util';
import { Router } from '@angular/router';
import { digest } from '@angular/compiler/src/i18n/serializers/xmb';
import { DivisionMatch } from '../models/divisionMatch';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TournamentRegistrationIdComponent } from '../tournament-registration-id/tournament-registration-id.component';

@Component({
  selector: 'app-all-registrations',
  templateUrl: './all-registrations.component.html',
  styleUrls: ['./all-registrations.component.scss']
})
export class AllRegistrationsComponent implements OnInit {

  public registrations: Array<Array<Registration>>;
  public isRegistrationsLoaded: boolean;
  private tournamentId: number;
  public typeSelected: number;
  public lockedDivisions: Array<number>;
  public divisions: Array<number>;
  public modalRef: BsModalRef; // {1}

  constructor(private data: DataService, private auth: AuthService, private route: ActivatedRoute, private router: Router, private modalService: BsModalService) {
    var maxNumberOfDivisions = 5;
    this.divisions = new Array();

    for (var i = 1; i <= maxNumberOfDivisions; i++) {
      this.divisions.push(i);
    }

    this.divisions.push(0);

    this.isRegistrationsLoaded = false;
    this.typeSelected = 2;
    this.lockedDivisions = new Array();

    this.route.params.subscribe((res: any) => {
      this.tournamentId = res.tournamentId;
      this.refresh(this.typeSelected);
    });
  }

  public refresh(teamType: number) {

    this.lockedDivisions = new Array();
    this.isRegistrationsLoaded = false;
    this.typeSelected = teamType;

    this.data.getRegistration(this.tournamentId, teamType).subscribe((s: any) => {
      this.registrations = new Array<Array<Registration>>();
      var registrations = <Registration[]>s;

      if (registrations.length == 0) {
        this.isRegistrationsLoaded = true;
        return;
      }

      var currentDivision = registrations[0].teamDivision;
      this.getDivisionMatches(currentDivision);

      var currentGroup: Array<Registration>;
      currentGroup = new Array<Registration>();
      this.registrations.push(currentGroup);
      for (var i = 0; i < registrations.length; i++) {
        if (registrations[i].teamDivision != currentDivision) {
          currentGroup = new Array<Registration>();
          currentDivision = registrations[i].teamDivision;
          this.getDivisionMatches(currentDivision);
          this.registrations.push(currentGroup);
        }

        currentGroup.push(registrations[i]);
      }

      this.isRegistrationsLoaded = true;
    });
  }

  isAdmin(): boolean {
    if (!this.auth.isLoggedIn()) {
      return false;
    }

    return this.auth.player.isAdmin;
  }

  private getDivisionMatches(division: number) {
    this.data.getMatches(this.tournamentId, this.typeSelected, division).subscribe((s: any) => {
      var matches = <DivisionMatch[]>s;
      if (matches.length > 0) {
        this.lockedDivisions.push(division);
      }
    });
  }

  public assignDivision(teamId: number, division: number) {
    this.data.assignDivision(teamId, division).subscribe((s: any) => {
      this.refresh(this.typeSelected);
    });
  }

  public isLocked(division: number) {

    for (var i = 0; i < this.lockedDivisions.length; i++) {
      if (this.lockedDivisions[i] == division) {
        return true;
      }
    }

    return false;
  }

  public viewMatches(division: number) {
    this.router.navigate(['/admin-arrange-matches-times/' + this.tournamentId + "/" + this.typeSelected + "/" + division]);
  }

  ngOnInit() {
  }

  arrangeMatches(division: number) {
    this.router.navigate(['/admin-arrange-matches/' + this.tournamentId + '/' + this.typeSelected + "/" + division]);
  }

  clearMatches(division: number) {
    this.divisionToDelete = division;
    this.showMessage("Aðvörun", "Ertu viss um að þú viljir eyða tímaplani fyrir deildina (deild " + division + ")?");
  };

  confirmDelete() {

    this.data.deleteMatches(this.tournamentId, this.typeSelected, this.divisionToDelete).subscribe(s => {
      this.refresh(this.typeSelected);

    });

    this.divisionToDelete = -1;
    this.modalRef.hide();
  }

  cancelDelete() {
    this.divisionToDelete = -1;
    this.modalRef.hide();
  }

  public modalHeader: string;
  public modalBody: string;
  public divisionToDelete: number;

  showMessage(header: string, body: string) {
    this.modalHeader = header;
    this.modalBody = body;
    document.getElementById("openMessageButton").click();
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template); // {3}
  }

  public fetchPaymentStatus(registration: Registration) {
    this.data.refreshPaymentStatus(registration.teamId).subscribe((s: any) => {
      var status = <PaymentStatus>s;
      registration.paymentStatus = status;
    });
  }

  public completeDeposit(registration: Registration) {
    this.data.completeDeposit(registration.teamId).subscribe(s => {
      this.data.refreshPaymentStatus(registration.teamId).subscribe((s: any) => {
        var status = <PaymentStatus>s;
        registration.paymentStatus = status;
      })
    });
  }

  public translatePaymentStatus(paymentStatus: string) {
    if (paymentStatus == "NOT_PAID") {
      return "Ógreitt!"
    } else if (paymentStatus == "PAID") {
      return "Greitt!"
    } else if (paymentStatus == "PENDING") {
      return "Ógreitt!"
    } else if (paymentStatus == "REJECTED") {
      return "Hafnað!"
    }

    return "Villa!"
  };

}
