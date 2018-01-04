import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Player } from './models/player';
import { CookieService } from 'angular2-cookie/core';
import { AuthData } from './models/authdata';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { CookieOptionsArgs } from 'angular2-cookie/services/cookie-options-args.model';
import { CookieOptions } from 'angular2-cookie/services/base-cookie-options';
import { Location } from '@angular/common';
import { BeachLocation } from './models/beachlocation';
import { Tournament } from './models/tournament';
import { Team } from './models/team';

@Injectable()
export class DataService {

  private baseUrl = "http://localhost:3564/";
  private apiUrl = this.baseUrl + "api/";

  constructor(private http: Http, private _cookieService: CookieService) {
    console.log("data service");
  }

  register(player: Player): Observable<Response> {
    console.log("registering");
    var result = this.http.post(this.apiUrl + "players", player);
    var tmp = result.map((res: Response) => res.json());
    return tmp;
  }

  registerLocation(location: BeachLocation): Observable<Response> {
    console.log("registerLocation");
    var result = this.http.post(this.apiUrl + "locations", location);
    var tmp = result.map((res: Response) => res.json());
    return tmp;
  }

  registerTournament(tournament: Tournament): Observable<Response> {

    var data: AuthData;
    data = <AuthData>this.load("authentication");

    console.log("registerTournament");
    var result = this.http.post(this.apiUrl + "tournaments", tournament, this.getAuthorizationRequestOption(data));
    var tmp = result.map((res: Response) => res.json());
    return tmp;
  }

  getTournaments(): Observable<Response> {
    var result = this.http.get(this.apiUrl + "tournaments");
    var tmp = result.map((res: Response) => res.json());
    return tmp;
  }

  getTournament(id: number): Observable<Response> {
    var result = this.http.get(this.apiUrl + "tournaments/" + id);
    var tmp = result.map((res: Response) => res.json());
    return tmp;
  }

  login(player: Player): Observable<Response> {
    var result = this.http.post(this.baseUrl + "token", "grant_type=password&username=" + player.id + "&password=" + player.password);
    var tmp = result.map((res: Response) => res.json());
    return tmp;
  }

  save(key: string, content: Object) {
    var option: CookieOptionsArgs;
    option = new CookieOptions();
    var expires = new Date();
    expires.setDate(expires.getDate() + 30);
    this._cookieService.putObject(key, content, { "expires": expires });
  }

  load(key: string): Object {
    return this._cookieService.getObject(key);
  }

  clear(key: string): void {
    this._cookieService.remove(key);
  }

  verifyLogin(auth: AuthData): Observable<Response> {
    var result = this.http.get(this.apiUrl + "players/loggedin", this.getAuthorizationRequestOption(auth));
    var tmp = result.map((player: Response) => player.json());
    return tmp;
  }

  getAuthorizationRequestOption(auth: AuthData): RequestOptions {

    let header = new Headers();
    header.append("Authorization", "Bearer " + auth.access_token);
    let options = new RequestOptions({ headers: header });
    return options;
  }

  changePassword(password: string) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");
    var result = this.http.post(this.apiUrl + "players/changepassword", { "Password": password },
      this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());
    return tmp;
  }

  getLocations(): Observable<Response> {
    var result = this.http.get(this.apiUrl + "locations");
    return result.map(s => s.json());
  }

  openRegistration(tournamentId: number): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "tournaments/" + tournamentId + "/registration/open", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }


  closeRegistration(tournamentId: number): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "tournaments/" + tournamentId + "/registration/close", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  findPlayerById(id: string): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "players/" + id, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  registerTeam(team: Team): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.post(this.apiUrl + "teams", team, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  getTournamentsStatus(player: Player) : Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "players/" + player.id + "/tournaments", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s=>s.json());

    return tmp;
  }
}
