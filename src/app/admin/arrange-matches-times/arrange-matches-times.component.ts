import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Court } from '../../models/court';
import { Tournament } from '../../models/tournament';
import { TimeSlot, TimeSlotName } from '../../models/timeslot';
import { Match } from '../../models/match';
import { GroupView } from '../../models/groupView';
import { DivisionMatch } from '../../models/divisionMatch';
import { MockNgModuleResolver } from '@angular/compiler/testing';

@Component({
  selector: 'app-arrange-matches-times',
  templateUrl: './arrange-matches-times.component.html',
  styleUrls: ['./arrange-matches-times.component.scss']
})
export class ArrangeMatchesTimesComponent implements OnInit {

  private tournamentId: number;
  private courts: Court[];
  private timeSlots: Array<TimeSlot>;
  private groupViews: Array<GroupView>;
  private selectedTimeSlot: TimeSlotName;

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

        this.data.getMatches(this.tournamentId).subscribe((s: any) => {
          this.sortMatches(<DivisionMatch[]>s);          
        });
      });
    });
  }

  sortMatches(matches: DivisionMatch[]) {
    this.groupViews = new Array();

    if (matches.length == 0) {
      return;
    }

    var currentView = new GroupView();
    currentView.division = matches[0].division;
    currentView.group = matches[0].divisionGroup;
    currentView.matches = new Array();
    currentView.type = matches[0].type;
    this.groupViews.push(currentView);

    for (var i = 0; i < matches.length; i++) {
      var match = matches[i];
      if (match.division != currentView.division ||
        match.divisionGroup != currentView.group ||
        match.type != currentView.type) {
        currentView = new GroupView();
        currentView.division = match.division;
        currentView.group = match.divisionGroup;
        currentView.type = match.type;
        currentView.matches = new Array();

        this.groupViews.push(currentView);
      }

      currentView.matches.push(match);

      var slot = this.findSlot(match.date, match.time);
      if (slot != null) {
        console.log("Found slot for match: " + match.label);
        var slotName = this.findSlotName(slot, match);
        if (slotName != null) {
          this.assignMatchToSlot(slotName, match, true);
        }
      }
    }
  }

  findSlotName(slot: TimeSlot, match: DivisionMatch) {
    for (var i = 0; i < slot.names.length; i++) {
      var name = slot.names[i];
      if (name.courtId == match.courtId) {
        // Assign
        return name;
      }
    }

    return null;
  }

  findSlot(date: string, time: string) {
    for (var i = 0; i < this.timeSlots.length; i++) {
      var slot = this.timeSlots[i];

      if (slot.day == date && slot.time == time) {
        return slot;      
      };
    }

    return null;
  }

  selectTimeslot(slot: TimeSlotName) {
    this.selectedTimeSlot = slot;
  }

  assignMatchToSlot(timeSlotName: TimeSlotName, match: DivisionMatch, initializing: boolean) {

    console.log('assigning: ' + match.label + " to " + timeSlotName.courtId);
    if (timeSlotName == null) {
      return;
    }

    if (timeSlotName.match != null) {
      this.clearMatchFromSlot(timeSlotName.match, initializing);
    }

    // is the match in another slot?
    this.clearMatchFromSlot(match, initializing);    
    timeSlotName.match = match;    
    match.courtId = timeSlotName.courtId;
    match.time = timeSlotName.time;
    match.date = timeSlotName.date;

    if (!initializing) {
      this.data.scheduleMatch(match).subscribe(s=>{});
    }
  }

  clearMatchFromSlot(match: DivisionMatch, initializing: boolean) {

    console.log("Clearing: " + match.label);

    match.courtId = -1;    
    for (var i = 0; i < this.timeSlots.length; i++) {
      var slot = this.timeSlots[i];
      for (var n = 0; n < slot.names.length; n++) {
        if (slot.names[n].match == match) {
          slot.names[n].match = null;
        }
      }
    }

    if(!initializing) {
      this.data.cancelMatch(match).subscribe(s => {});
    }
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
        timeslot.date = startOfSlot.toISOString();
        timeslot.day = startOfSlot.toISOString().substr(0, 10);
        timeslot.time = startOfSlot.toLocaleTimeString("is-IS", options);

        timeslot.names = new Array();
        timeslot.slot = slot;

        for (var c = 0; c < this.courts.length; c++) {
          var court = this.courts[c];
          var courtId = court.id;
          var slotName = new TimeSlotName();
          slotName.courtId = courtId;
          slotName.match = null;
          slotName.date = timeslot.day;
          slotName.time = timeslot.time;

          timeslot.names.push(slotName);          
        }

        startOfSlot.setMinutes(startOfSlot.getMinutes() + minutesForEachGame);
        console.log("StartOfSlot: " + startOfSlot);

        slot++;

        this.timeSlots.push(timeslot);
      }
    }

    console.log("Generated timeslots: " + this.timeSlots.length);
  }

  getDescriptionFromType(type: number) {
    if (type == 1) {
      return "Karlar";
    } else if (type == 2) {
      return "Konur";
    }

    return ""
  }

  getDescriptionFromGroup(group: number) {
    if (group == 0) {
      return "A";
    } else if (group == 1) {
      return "B";
    } else if (group == 2) {
      return "C";
    } else if (group == 3) {
      return "D";
    }
  }

  getColor(match: DivisionMatch, inGameList: boolean): string {

    if (inGameList && match.courtId >= 0) {
      return "#D3D3D3";
    }

    if (match.type == 1) {
      if (match.division == 1) {
        if (match.divisionGroup == 1) {
          return "#007194";
        } else if (match.divisionGroup == 2) {
          return "#0099D3";
        } else {
          return "#6FBEE5";
        }
      }
    }

    return "#445566";

  }

  ngOnInit() {
  }
}
