import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Court } from '../../models/court';
import { Tournament } from '../../models/tournament';
import { TimeSlot } from '../../models/timeslot';

@Component({
  selector: 'app-arrange-matches-times',
  templateUrl: './arrange-matches-times.component.html',
  styleUrls: ['./arrange-matches-times.component.scss']
})
export class ArrangeMatchesTimesComponent implements OnInit {

  private tournamentId: number;
  private courts: Court[];
  private timeSlots: Array<TimeSlot>;

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private auth: AuthService,
    private router: Router) {

    this.courts = new Array();

    this.route.params.subscribe((res: any) => {
      this.tournamentId = res.tournamentId;
      this.courts = null;

      this.data.getTournament(this.tournamentId).subscribe((s: any) => {
        var tournament = <Tournament>s;
        console.log(tournament.unixDateTicks);

        var date = new Date(tournament.unixDateTicks);
        date.setHours(8);
        date.setMinutes(0);
        this.courts = tournament.location.courts;

        this.generateTimeSlots(date);

        this.data.getMatches(this.tournamentId).subscribe((s:any) => {
          console.log(s);
        });
      });

    });

  }

  generateTimeSlots(startDate: Date) {
    var options = {
      minute: "2-digit",
      hour: "2-digit"
    };

    var minutesForEachGame = 40;
    this.timeSlots = new Array();
    console.log("Generating timeslots: " + startDate);

    for (var i = 0; i < 3; i++) {
      var currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      var startOfSlot = new Date(startDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), startDate.getHours(), startDate.getMinutes());

      var slot = 0;
      while (startOfSlot.getHours() < 22) {
        
        var timeslot = new TimeSlot();
        timeslot.day = startOfSlot.toISOString();
        timeslot.time = startOfSlot.toLocaleTimeString("is-IS", options);        

        timeslot.names = new Array();
        timeslot.slot = slot;

        for (var c = 0; c < this.courts.length; c++)
        {          
           var name = "D" + i + "-S" + slot + "-C" + c;
           timeslot.names.push(name);
        }

        startOfSlot.setMinutes(startOfSlot.getMinutes() + minutesForEachGame);
        console.log("StartOfSlot: " + startOfSlot);

        slot++;

        this.timeSlots.push(timeslot);
      }
    }

    console.log("Generated timeslots: " + this.timeSlots.length);
  }

  ngOnInit() {
  }
}
