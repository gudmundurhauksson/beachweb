import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { AuthData } from '../models/authdata';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { registerLocaleData } from '@angular/common/src/i18n/locale_data';
import { Registration } from '../models/registration';

@Component({
  selector: 'app-all-registrations',
  templateUrl: './all-registrations.component.html',
  styleUrls: ['./all-registrations.component.scss']
})
export class AllRegistrationsComponent implements OnInit {

  public mensRegistrations: Registration[];
  public isMensRegistrationsLoaded: boolean;

  constructor(private data: DataService, private auth: AuthService, private route: ActivatedRoute) { 
    this.isMensRegistrationsLoaded = false;
    this.route.params.subscribe((res: any) => {
      var tournamentId = res.tournamentId;

      data.getRegistration(tournamentId, 0x01).subscribe((s: any) => {
        console.log(s);
        this.mensRegistrations = <Registration[]>s;        
        this.isMensRegistrationsLoaded = true;
      })
    });
  }

  ngOnInit() {
  }

}
