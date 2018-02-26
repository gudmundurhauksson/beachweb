import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Player } from './models/player';
import { AuthData } from './models/authdata';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable()
export class AuthService {

  private _isLoggedIn: boolean;
  public player: Player;

  constructor(private _data: DataService, private router: Router) {
    console.log("auth service");
    this._loadLogin();
  }

  private _loadLogin(): void {
    var data: AuthData;
    data = <AuthData>this._data.load("authentication");

    if (data === undefined) {
      return;
    }

    var result = this._data.verifyLogin(data);
    result.subscribe((player: Object) => {
      this.player = <Player>player;
      this._isLoggedIn = true;
      console.log(this.player);
    }, err => {
      console.log(err);
      this._isLoggedIn = false;
      this.player = null;
    });
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  logout() {
    this._isLoggedIn = false;
    this._data.clear("authentication");
  }

  login(player: Player): Observable<number> {

    return new Observable(observer => {
      var result = this._data.login(player);
      result.subscribe(s => {
        this._data.save("authentication", s);
        this._loadLogin();
        this.router.navigate(['']);

        observer.next(200);
        observer.complete();
      },
        (error: any) => {
          console.log(error);
          observer.next(error.status);
          observer.complete();
        });

    });

  }

}
