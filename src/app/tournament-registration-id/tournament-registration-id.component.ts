import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { Player } from '../models/player';
import { Tournament } from '../models/tournament';
import { AuthService } from '../auth.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { TemplateRef } from '@angular/core/src/linker/template_ref';
import { Router } from '@angular/router';
import { Team } from '../models/team';
import { isRegExp } from 'util';

@Component({
  selector: 'app-tournament-registration-id',
  templateUrl: './tournament-registration-id.component.html',
  styleUrls: ['./tournament-registration-id.component.scss']
})
export class TournamentRegistrationIdComponent implements OnInit {

  private id: number;
  public tournament: Tournament;
  public tournamentType: number;  
  public existingId: string;
  public modalRef: BsModalRef; // {1}
  public otherPlayer: Player;
  public isWaiting : boolean;
  public isSearching : boolean;
  public isRegistering : boolean;
  public players: Player[];
  public noPlayerFound: boolean;

  constructor(private route: ActivatedRoute, private data: DataService,
    private auth: AuthService, private modalService: BsModalService,
    private router: Router) {

    this.noPlayerFound = false;
    this.isWaiting = true;
    this.isSearching = false;    
    this.tournament = null;
    this.isRegistering = false;
    this.players = new Array();

    if (!auth.isLoggedIn()) {
      this.router.navigate(['login']);
      return;
    }

    this.route.params.subscribe((res: any) => {
      this.id = res.id

      data.getTeamByPlayerIdAndTournamentId(this.auth.player.id, this.id).subscribe((s: any) => {
          this.router.navigate(['my-tournaments']);
          return;
      }, (error: any) => {
        
        console.log("Player not registered in a team");
        data.getTournament(this.id).subscribe((s: any) => {
          this.isWaiting = false;
          this.tournament = s;
          console.log("Type: " + this.tournament.type);

          if(this.isMaleTournament()) {
            this.tournamentType = 0x01;
          } else if (this.isFemaleTournament()) {
            this.tournamentType = 0x02;
          } else if (this.isMaleYouthTournament()) {
            this.tournamentType = 0x04;
          } else {
            this.tournamentType = 0x08;
          }

        }, (err: any) => {
          console.log(err);
          this.isWaiting = false;
        });
      });
    });
  }

  isMaleTournament(): boolean {

    if (this.tournament == null || this.auth.player == null) {
      return false;
    }

    return (this.tournament.type & 0x01) > 0 && this.auth.player.isMale;
  }

  isFemaleTournament(): boolean {
    if (this.tournament == null || this.auth.player == null) {
      return false;
    }

    return (this.tournament.type & 0x02) > 0 && !this.auth.player.isMale;
  }

  isMaleYouthTournament(): boolean {
    if (this.tournament == null || this.auth.player == null) {
      return false;
    }
    
    return (this.tournament.type & 0x04) > 0 && this.auth.player.isMale;
  }

  isFemaleYouthTournament(): boolean {
    if (this.tournament == null || this.auth.player == null) {
      return false;
    }

    return (this.tournament.type & 0x08) > 0 && !this.auth.player.isMale;
  }

  loggedInPlayer(): Player {

    if (this.auth.player == null) {
      return new Player();
    }

    return this.auth.player;
  }

  // search(): void {
  //   if(this.existingId === undefined || this.existingId == null || this.existingId.length == 0) {
  //     this.showMessage("Villa", "Vantar kennitölu");
  //     return;
  //   }

  //   this.isSearching = true;
  //   this.data.findPlayerById(this.existingId).subscribe((s: any) => {
  //     var found: Player;
  //     found = s;

  //     this.isSearching = false;

  //     if (found.id == this.loggedInPlayer().id) {
  //       this.showMessage("Villa", "Þessi leikmaður er þegar skráður í liðið.")
  //       return;
  //     }

  //     if(found.isMale != this.loggedInPlayer().isMale) {
  //       this.showMessage("Villa", "Ekki er hægt að skrá blönduð lið!");
  //       return;
  //     } 

  //     this.otherPlayer = found;


  //   }, (err: any) => {
  //     this.isSearching = false;
  //     if (err.status == 404) {
  //       document.getElementById('openModalButton').click();
  //     }
  //   });
  // }

  searchByName() : void {
    if(this.existingId === undefined || this.existingId == null || this.existingId.length == 0) {
      this.showMessage("Villa", "Vantar nafn");
      return;
    }

    this.isSearching = true;
    this.noPlayerFound = false;
    
    this.data.findPlayerByName(this.existingId, this.auth.player.isMale ? 0x01 : 0x02).subscribe((s : any) => {
      this.isSearching = false;
      console.log(this.players);
      this.players = <Player[]>s;
      this.noPlayerFound = this.players.length == 0;
    }, error => {
      this.isSearching = false;
    });
  }

  selectOtherPlayer(otherPlayer : Player) {
    this.otherPlayer = otherPlayer;
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

  public newPlayer(): void {
    this.modalRef.hide();
    this.router.navigate(['/newuser/' + this.existingId]);
  }

  public cancel(): void {
    this.otherPlayer = null;
    this.players = new Array();
    this.existingId = "";
  }

  public canConfirm(): boolean {
    return this.loggedInPlayer() != null && this.existingId != null && this.tournamentType > 0;
  }

  public getBirthDate(personalId: string) {
    return personalId.substr(0, 6);
  }

  public confirm(): void {
    var team = new Team();
    team.player1Id = this.loggedInPlayer().id;
    team.player2Id = this.otherPlayer.id;
    team.tournamentId = this.tournament.id;
    team.teamTypeId = this.tournamentType;
    this.isRegistering = true;
    
    if (team.player1Id == team.player2Id) {
      this.showMessage("Villa", "Tveir leikmenn þurfa að vera í liðinu!");
      this.otherPlayer = null;  
      this.isRegistering = false;    
      return;
    }
    
    console.log(team);

    this.data.registerTeam(team).subscribe((s: any) => {
      this.isRegistering = false;
      this.router.navigate(['/my-tournaments']);
    }, err => {      
      console.log(err);
      var errorMessage = err.json().message;
      console.log(errorMessage);
      this.isRegistering = false;
      
      if (errorMessage == "PLAYER_IN_ANOTHER_TEAM") {
        this.showMessage("Villa", "Leikmaður 2 er skráður í annað lið.");        
        return;
      } else if (errorMessage == "TEAM_HAS_DUPLICATES") {
        this.showMessage("Villa", "Velja þarf tvo leikmenn.")
        return;
      }

      this.showMessage("Villa", errorMessage);
      console.log(err);
    });
  }

  ngOnInit() {
  }

}
