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
import { DivisionMatch } from '../models/divisionMatch';

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

  constructor(private data: DataService, private auth: AuthService, private route: ActivatedRoute, private router: Router) {    
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
      this.getDivisionMatches(currentDivision);

      var currentGroup : Array<Registration>;
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

  private getDivisionMatches(division: number) {    
    this.data.getMatches(this.tournamentId, this.typeSelected, division).subscribe((s:any) => {
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
}
