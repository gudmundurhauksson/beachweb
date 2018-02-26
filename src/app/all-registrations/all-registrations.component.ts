import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { AuthData } from '../models/authdata';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { registerLocaleData } from '@angular/common/src/i18n/locale_data';
import { Registration } from '../models/registration';
import { isEmbeddedView } from '@angular/core/src/view/util';
import { Router } from '@angular/router';
import { digest } from '@angular/compiler/src/i18n/serializers/xmb';

@Component({
  selector: 'app-all-registrations',
  templateUrl: './all-registrations.component.html',
  styleUrls: ['./all-registrations.component.scss']
})
export class AllRegistrationsComponent implements OnInit {

  public mensRegistrations: Array<Array<Registration>>;
  public isMensRegistrationsLoaded: boolean;
  private tournamentId: number;

  constructor(private data: DataService, private auth: AuthService, private route: ActivatedRoute, private router: Router) {    
    this.isMensRegistrationsLoaded = false;    

    this.route.params.subscribe((res: any) => {
      this.tournamentId = res.tournamentId;
      this.refresh(this.tournamentId);
    });
  }

  private refresh(tournamentId: number) {
    this.isMensRegistrationsLoaded = false;

    this.data.getRegistration(tournamentId, 0x01).subscribe((s: any) => {
      console.log(s);

      this.mensRegistrations = new Array<Array<Registration>>();

      var mensRegistrations = <Registration[]>s;

      if (mensRegistrations.length == 0) {
        this.isMensRegistrationsLoaded = true;
        return;
      }

      var currentDivision = mensRegistrations[0].teamDivision;
      var currentGroup : Array<Registration>;
      currentGroup = new Array<Registration>();
      this.mensRegistrations.push(currentGroup);
      for (var i = 0; i < mensRegistrations.length; i++) {
        if (mensRegistrations[i].teamDivision != currentDivision) {
          currentGroup = new Array<Registration>();
          currentDivision = mensRegistrations[i].teamDivision;
          this.mensRegistrations.push(currentGroup);
        }

        currentGroup.push(mensRegistrations[i]);
      }

      this.isMensRegistrationsLoaded = true;
    });
  }

  public assignDivision(teamId: number, division: number) {
    this.data.assignDivision(teamId, division).subscribe((s: any) => {
      this.refresh(this.tournamentId);
    });
  }

  ngOnInit() {
  }

  arrangeMatches(division: number) {
    this.router.navigate(['/arrange-matches/' + this.tournamentId + '/' + division]);
  }
}
