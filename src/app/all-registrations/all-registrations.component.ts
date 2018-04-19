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

  public registrations: Array<Array<Registration>>;
  public isRegistrationsLoaded: boolean;
  private tournamentId: number;
  public typeSelected: number;

  constructor(private data: DataService, private auth: AuthService, private route: ActivatedRoute, private router: Router) {    
    this.isRegistrationsLoaded = false;    
    this.typeSelected = 2;

    this.route.params.subscribe((res: any) => {
      this.tournamentId = res.tournamentId;
      console.log('in here');
      this.refresh(this.typeSelected);
    });
  }

  public refresh(teamType: number) {

    console.log("Refreshing: " + teamType);

    this.isRegistrationsLoaded = false;
    this.typeSelected = teamType;

    this.data.getRegistration(this.tournamentId, teamType).subscribe((s: any) => {
      console.log(s);

      this.registrations = new Array<Array<Registration>>();

      var registrations = <Registration[]>s;

      if (registrations.length == 0) {
        this.isRegistrationsLoaded = true;
        return;
      }

      var currentDivision = registrations[0].teamDivision;
      var currentGroup : Array<Registration>;
      currentGroup = new Array<Registration>();
      this.registrations.push(currentGroup);
      for (var i = 0; i < registrations.length; i++) {
        if (registrations[i].teamDivision != currentDivision) {
          currentGroup = new Array<Registration>();
          currentDivision = registrations[i].teamDivision;
          this.registrations.push(currentGroup);
        }

        currentGroup.push(registrations[i]);
      }

      this.isRegistrationsLoaded = true;
    });
  }

  public assignDivision(teamId: number, division: number) {
    this.data.assignDivision(teamId, division).subscribe((s: any) => {
      this.refresh(this.typeSelected);
    });
  }

  ngOnInit() {
  }

  arrangeMatches(division: number) {
    this.router.navigate(['/arrange-matches/' + this.tournamentId + '/' + this.typeSelected + "/" + division]);
  }  
}
