import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { Player } from '../models/player';
import { Tournament } from '../models/tournament';
import { AuthService } from '../auth.service';

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
  public registerNewPlayer: boolean;

  constructor(private route: ActivatedRoute, private _data: DataService, private _auth: AuthService) {

    this.player = new Player();
    this.tournament = new Tournament();
    this.registerNewPlayer = false;

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

    if(this._auth.player == null) {
      return new Player();
    }

    return this._auth.player;
  }

  ngOnInit() {
  }

}
