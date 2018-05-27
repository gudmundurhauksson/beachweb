import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Court } from '../../models/court';
import { Tournament } from '../../models/tournament';
import { TimeSlot, TimeSlotName, DateVisibility } from '../../models/timeslot';
import { Match } from '../../models/match';
import { GroupView } from '../../models/groupView';
import { DivisionMatch } from '../../models/divisionMatch';
import { MockNgModuleResolver } from '@angular/compiler/testing';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-arrange-matches-times',
  templateUrl: './arrange-matches-times.component.html',
  styleUrls: ['./arrange-matches-times.component.scss']
})
export class ArrangeMatchesTimesComponent implements OnInit {

  private tournamentId: number;
  public courts: Court[];
  public timeSlots: Array<TimeSlot>;
  public groupViews: Array<GroupView>;
  private selectedTimeSlot: TimeSlotName;
  private dateVisibility: Array<DateVisibility>;
  private tournament: Tournament;

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private auth: AuthService,
    private router: Router) {

    if (!this.auth.isLoggedIn()) {
      //this.router.navigate(['/login']);
      //return;
    }

    this.courts = new Array();
    this.dateVisibility = new Array();

    this.route.params.subscribe((res: any) => {
      this.tournamentId = res.tournamentId;
      this.courts = null;

      this.data.getTournament(this.tournamentId).subscribe((s: any) => {
        this.tournament = <Tournament>s;

        var date = new Date(this.tournament.unixDateTicks);
        date.setHours(8);
        date.setMinutes(0);
        this.courts = this.tournament.location.courts;

        this.generateTimeSlots(date);

        this.data.getMatches(this.tournamentId).subscribe((s: any) => {
          this.sortMatches(<DivisionMatch[]>s);
        });
      });
    });
  }

  toggleButton(index: number) {
    this.getVisibility(index).isVisible = !this.getVisibility(index).isVisible;
  }

  prepareButton(index: number) {
    var current = this.getVisibility(index);
    if (current.buttonIndex == index) {
      return;
    }

    var visibility = new DateVisibility(true, index);
    this.dateVisibility.push(visibility);
  }

  getVisibility(index: number): DateVisibility {
    for (var i = this.dateVisibility.length - 1; i >= 0; i--) {
      if (this.dateVisibility[i].buttonIndex <= index) {
        return this.dateVisibility[i];
      }
    }

    return new DateVisibility(true, -1);
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
    
    if (timeSlotName == null) {
      return;
    }

    // console.log("assigning match: " + timeSlotName.time + " m: " + match.label);

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
      this.data.scheduleMatch(match).subscribe(s => { });
    }
  }

  autoAssignment(matches: DivisionMatch[]) {
    console.log("assigning");
    var current = matches[0];

    // start by clearing all 
    for (var i = 1; i < matches.length; i++) {
      this.clearMatchFromSlot(matches[i], false);
    }

    for (var i = 1; i < matches.length; i++) {
      var slot = this.findSlot(current.date, current.time).next;      
      var slotName = this.findSlotName(slot, current);
      
      current = matches[i];
      console.log("SlotName. " + slotName.time + " match: " + current.label);
      this.assignMatchToSlot(slotName, current, false);
    }
  }

  clearMatchFromSlot(match: DivisionMatch, initializing: boolean) {
    
    if (match.courtId == -1) {
      return;
    }

    for (var i = 0; i < this.timeSlots.length; i++) {
      var slot = this.timeSlots[i];
      for (var n = 0; n < slot.names.length; n++) {
        if (slot.names[n].match == match) {
          slot.names[n].match = null;
          match.courtId = -1;
        }
      }
    }

    if (!initializing) {
      this.data.cancelMatch(match).subscribe(s => { });
    }
  }

  generateTimeSlots(startDate: Date) {
    var options = {
      minute: "2-digit",
      hour: "2-digit"
    };

    var minutesForEachGame = 40;
    this.timeSlots = new Array();

    for (var i = 0; i < this.tournament.days; i++) {
      var currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      var startOfSlot = new Date(startDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), startDate.getHours(), startDate.getMinutes());
      var slot = 0;
      var currentTimeSlot = null;
      while (startOfSlot.getHours() < 22) {
        
        var timeslot = new TimeSlot();
        if (currentTimeSlot != null) {
          currentTimeSlot.next = timeslot;
        }
        currentTimeSlot = timeslot;

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
        slot++;

        this.timeSlots.push(timeslot);
      }
    }
  }

  getDescriptionFromType(type: number) {
    if (type == 1) {
      return "Karlar";
    } else if (type == 2) {
      return "Konur";
    }

    return ""
  }

  downloadScoresheet(tournamentId: number, teamType: number, division: number) {
    console.log("...");
    this.data.getScoreSheets(tournamentId, teamType, division).subscribe(blob => {
      FileSaver.saveAs(blob, "scoresheet-" + tournamentId + "-" + teamType + "-" + division + ".zip");
    });
  }

  getDescriptionFromGroup(group: number) {
    if (group == 0) {
      return "Riðill A";
    } else if (group == 1) {
      return "Riðill B";
    } else if (group == 2) {
      return "Riðill C";
    } else if (group == 3) {
      return "Riðill D";
    } else if (group == 1000) {
      return "Úrslit - 1. deild";
    } else if (group == 2000) {
      return "Úrslit - 2. deild";
    } else if (group == 3000) {
      return "Úrslit - 3. deild";
    } else if (group == 4000) {
      return "Úrslit - 4. deild";
    }
  }

  getColor(match: DivisionMatch, inGameList: boolean): string {

    if (inGameList && match.courtId >= 0) {
      return "#D3D3D3";
    }

    // https://graf1x.com/list-of-colors-with-color-names/
    if (match.type == 1) {
      if (match.division == 1) {
        if (match.divisionGroup == 0) {
          return "#007194";
        } else if (match.divisionGroup == 1) {
          return "#0099D3";
        } else {
          return "#6FBEE5";
        }
      } else if (match.division == 2) {
        if (match.divisionGroup == 0) {
          return "#007251";
        } else if (match.divisionGroup == 1) {
          return "#4EA32A";
        } else {
          return "#66883F";
        }
      }
    } else if (match.type == 2) {
      if (match.division == 1) {
        if (match.divisionGroup == 0) {
          return "#982257";
        } else if (match.divisionGroup == 1) {
          return "#D2434E";
        } else if (match.divisionGroup == 2) {
          return "#D76776";
        } else {
          return "#633686";
        }
      } else if (match.division == 2) {
        if (match.divisionGroup == 0) {
          return "#81007f";
        } else if (match.divisionGroup == 1) {
          return "#8d4585";
        } else {
          return "#311432";
        }
      } else if (match.division == 3) {
        if (match.divisionGroup == 0) {
          return "#6f2da8";
        } else if (match.divisionGroup == 1) {
          return "#9966cb";
        } else {
          return "#702963";
        }
      }

    }

    return "#445566";

  }

  getDateString(date: string): string {
    var dateObj = new Date(date);
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return this.translate(dateObj.toLocaleDateString('en-US', options));
  }

  translate(date: string): string {
    return date
      .replace("Thursday", "Fimmtudagur")
      .replace("Friday", "Föstudagur")
      .replace("Saturday", "Laugardagur")
      .replace("Sunday", "Sunnudagur")
      .replace("June", "Júní")
      .replace("May", "Maí")
      .replace("July", "Júlí")
      .replace("August", "Ágúst");
  }

  ngOnInit() {
  }
}
