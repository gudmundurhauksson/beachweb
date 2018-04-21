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
import { ScoresModel } from './models/scoresmodel';
import { GroupModel } from './models/groupModel';
import { DivisionMatch } from './models/divisionMatch';

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

  getTournaments(year: number): Observable<Response> {
    var result = this.http.get(this.apiUrl + "tournaments/filterbyyear/" + year);
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

  changePassword(password: string) : Observable<Response> {
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

  getTeamByPlayerIdAndTournamentId(personalId: string, tournamentId: number) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "teams/" + personalId + "/tournament/" + tournamentId, this.getAuthorizationRequestOption(data));
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

  cancelRegistration(teamId: number) : Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "teams/" + teamId + "/cancel", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s=>s.json());

    return tmp;
  }

  sendKassRequest(gsm: string) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "payments/kass/" + gsm, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s=>s.json());

    return tmp;
  }

  sendAurRequest(gsm: string) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "payments/aur/" + gsm, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s=>s.json());

    return tmp;
  }

  getTotalPlayerScoresByTypeAndYear(type: number, year: number) : Observable<Response> {
    var result= this.http.get(this.apiUrl + "scores/" + type + "/total/" + year);
    var tmp = result.map(s=>s.json());

    return tmp;
  }

  getTournamentPlayersScoresByTypeAndYear(type: number, year: number) : Observable<Response> {
    var result= this.http.get(this.apiUrl + "scores/" + type + "/tournaments/" + year);
    var tmp = result.map(s=>s.json());

    return tmp;
  }

  getRegistration(tournamentId: number, teamType: number) : Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "registrations/" + tournamentId + "/" + teamType, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s=>s.json());

    return tmp;
  }

  getTeamRegistration(tournamentId: number, teamType: number, teamId: number) : Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "registrations/" + tournamentId + "/" + teamType + "/" + teamId, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s=>s.json());

    return tmp;
  }

  assignDivision(teamId: number, division: number) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "teams/" + teamId + "/division/" + division, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s=>s.json());

    return tmp;
  }

  requestPasswordReset(playerId: string) : Observable<Response> {
    var result= this.http.get(this.apiUrl + "players/" + playerId + "/requestresetpassword");
    var tmp = result.map(s=>s.json());

    return tmp;
  }

  resetPassword(requestId: string) : Observable<Response> {
    var result= this.http.get(this.apiUrl + "players/" + requestId + "/resetpassword");
    var tmp = result.map(s=>s.json());

    return tmp;
  }

  canPay(teamId: number, payingPlayerId: string) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "payments/" + teamId + "/canpay/" + payingPlayerId, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s=>s.json());

    return tmp;
  }

  verifyPayment(teamId: number) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "payments/" + teamId + "/verify", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s=>s.json());

    return tmp;
  }

  getGroups(tournamentId: number, teamTypeId: number, division: number, groupRule: number) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");
    
    var result = this.http.get(this.apiUrl + "registrations/" + tournamentId + "/" + teamTypeId + "/" + division + "/" + groupRule  + "/calculate_groups", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s=>s.json());

    return tmp;
  }

  calculateMatches(group: GroupModel) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.post(this.apiUrl + "matches/calculate", group, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s=>s.json());

    return tmp;
  }
  
  confirmMatchList(groups: GroupModel[]) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.post(this.apiUrl + "matches/confirm", groups, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s=>s.json());

    return tmp;
  }

  getMatches(tournamentId: number, teamType?: number, division?: number) {

    var tmp = null;
    if (teamType != null && division != null)
    {
      var result = this.http.get(this.apiUrl + "matches/" + tournamentId + "/" + teamType + "/" + division);
      tmp = result.map(s=>s.json());
    } else {
      var result = this.http.get(this.apiUrl + "matches/" + tournamentId);
      tmp = result.map(s=>s.json());
    }

    return tmp;
  }  

  cancelMatch(match: DivisionMatch) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.post(this.apiUrl + "matches/cancel", match, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s=>s.json());

    return tmp;
  }

  scheduleMatch(match: DivisionMatch) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.post(this.apiUrl + "matches/schedule", match, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s=>s.json());

    return tmp;
  }
}
