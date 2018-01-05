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

@Component({
  selector: 'app-tournament-registration-id',
  templateUrl: './tournament-registration-id.component.html',
  styleUrls: ['./tournament-registration-id.component.scss']
})
export class TournamentRegistrationIdComponent implements OnInit {

  private id: number;
  public tournament: Tournament;
  public tournamentType: number;
  public player: Player;
  public existingId: string;
  public modalRef: BsModalRef; // {1}
  public otherPlayer: Player;

  constructor(private route: ActivatedRoute, private _data: DataService,
    private _auth: AuthService, private modalService: BsModalService,
    private router: Router) {

    this.player = new Player();
    this.tournament = new Tournament();

    this.route.params.subscribe((res: any) => {



      this.id = res.id
      _data.getTournament(this.id).subscribe((s: any) => {
        this.tournament = s;
      }, (err: any) => {
        console.log(err);
      });
    });
  }

  isMaleTournament(): boolean {

    if (this.tournament == null || this._auth.player == null) {
      return false;
    }

    return (this.tournament.type | 0x01) > 0 && this._auth.player.isMale;
  }

  isFemaleTournament(): boolean {
    if (this.tournament == null || this._auth.player == null) {
      return false;
    }

    return (this.tournament.type | 0x02) > 0 && !this._auth.player.isMale;
  }

  isMaleYouthTournament(): boolean {
    if (this.tournament == null || this._auth.player == null) {
      return false;
    }

    return (this.tournament.type | 0x04) > 0 && this._auth.player.isMale;
  }

  isFemaleYouthTournament(): boolean {
    if (this.tournament == null || this._auth.player == null) {
      return false;
    }

    return (this.tournament.type | 0x08) > 0 && !this._auth.player.isMale;
  }

  loggedInPlayer(): Player {

    if (this._auth.player == null) {
      return new Player();
    }

    return this._auth.player;
  }

  search(): void {
    this._data.findPlayerById(this.existingId).subscribe((s: any) => {
      var found: Player;
      found = s;
      if (found.id == this.loggedInPlayer().id) {
        console.log("Error, same player");
        return;
      }

      console.log("found player");
      this.otherPlayer = found;
    }, (err: any) => {
      if (err.status == 404) {
        document.getElementById('openModalButton').click();
      }
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

  public newPlayer(): void {
    this.modalRef.hide();
    this.router.navigate(['/newuser/' + this.existingId]);
  }

  public cancel(): void {
    this.otherPlayer = null;
  }

  public canConfirm(): boolean {
    return this.loggedInPlayer() != null && this.existingId != null && this.tournamentType > 0;
  }

  public confirm(): void {
    var team = new Team();
    team.player1Id = this.loggedInPlayer().id;
    team.player2Id = this.existingId;
    team.tournamentId = this.tournament.id;
    team.teamTypeId = this.tournamentType;

    this._data.registerTeam(team).subscribe((s: any) => {
      this.router.navigate(['/my-tournaments']);
    }, (err: any) => {
      this.showMessage("Villa", err);
      console.log(err);
    });
  }

  ngOnInit() {
  }

}
