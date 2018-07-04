import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { Team } from '../models/team';
import { Player } from '../models/player';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-replace-team-player',
  templateUrl: './replace-team-player.component.html',
  styleUrls: ['./replace-team-player.component.scss']
})
export class ReplaceTeamPlayerComponent implements OnInit {

  public player: Player;
  public existingId: string;
  public isSearching : boolean;
  public players: Player[];
  public noPlayerFound: boolean;
  public modalRef: BsModalRef; // {1}
  public otherPlayer: Player;
  public isRegistering : boolean;
  private teamId: number;
  private team: Team;
  
  constructor(private route: ActivatedRoute, private data: DataService, private auth: AuthService, private router: Router, private modalService: BsModalService) { 

    this.player = new Player();

    this.route.params.subscribe((s:any) => {
      
      var playerId: string;
      this.teamId = s.teamId;
      playerId = s.playerId;
      
      this.data.findPlayerById(playerId).subscribe((s: any) => {
        this.player = <Player>s;
      });

      this.data.getTeamById(this.teamId).subscribe((s: any)=> {
        this.team = <Team>s;
      });
    });
  }

  public canConfirm(): boolean {
    return this.auth.isLoggedIn() && this.otherPlayer != null;
  }

  public confirm(): void {
    
    this.data.replacePlayerInTeam(this.teamId, this.player.id, this.otherPlayer.id).subscribe((s: any) => {
      this.isRegistering = false;
      this.router.navigate(['/admin-all-registrations/' + this.team.tournamentId]);
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

  public cancel(): void {
    this.router.navigate(['/admin-all-registrations/' + this.team.tournamentId]);
  }

  selectOtherPlayer(otherPlayer : Player) {
    this.otherPlayer = otherPlayer;
  }

  searchByName() : void {

    if(this.existingId === undefined || this.existingId == null || this.existingId.length == 0) {
      this.showMessage("Villa", "Vantar nafn");
      return;
    }

    this.isSearching = true;
    this.noPlayerFound = false;
    
    this.data.findPlayerByName(this.existingId, this.player.isMale ? 0x01 : 0x02).subscribe((s : any) => {
      this.isSearching = false;
      console.log(this.players);
      this.players = <Player[]>s;
      this.noPlayerFound = this.players.length == 0;
    }, error => {
      this.isSearching = false;
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

  public getBirthDate(personalId: string) {
    return personalId.substr(0, 6);
  }

  ngOnInit() {
  }

}
