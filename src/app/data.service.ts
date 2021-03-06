import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Response, ResponseContentType } from '@angular/http';
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
import { SimpleDivisionMatchResult } from './models/simpleDivisionMatchResult';
import { Comment } from './models/comment';
import { Support } from './models/support';
import { SimpleDivisionMatch } from './models/simpleDivisionMatch';
import { DivisionGroupEntry } from './models/divisionGroupTable';

@Injectable()
export class DataService {

  private baseUrl = "https://www.stigakerfi.net/api/";
  //private baseUrl = "http://localhost:3564/";
  private apiUrl = this.baseUrl + "api/";

  constructor(private http: Http, private cookieService: CookieService) {
  }

  register(player: Player): Observable<Response> {
    var result = this.http.post(this.apiUrl + "players", player);
    var tmp = result.map((res: Response) => res.json());
    return tmp;
  }

  registerLocation(location: BeachLocation): Observable<Response> {
    var result = this.http.post(this.apiUrl + "locations", location);
    var tmp = result.map((res: Response) => res.json());
    return tmp;
  }

  registerTournament(tournament: Tournament): Observable<Response> {

    var data: AuthData;
    data = <AuthData>this.load("authentication");

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
    this.cookieService.putObject(key, content, { "expires": expires });
  }

  load(key: string): Object {
    return this.cookieService.getObject(key);
  }

  clear(key: string): void {
    this.cookieService.remove(key);
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

  changePassword(password: string): Observable<Response> {
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

  updateTournament(tournament: Tournament) : Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.put(this.apiUrl + "tournaments/" + tournament.id, tournament, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
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

  findPlayerByName(name: string, type: number): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "players/find/" + name + "/" + type, this.getAuthorizationRequestOption(data));
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

  replacePlayerInTeam(teamId: number, oldPlayerId: string, newPlayerId: string) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "teams/" + teamId + "/replace/" + oldPlayerId + "/" + newPlayerId,this.getAuthorizationRequestOption(data));
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

  getTournamentsStatus(player: Player): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "players/" + player.id + "/tournaments", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  cancelRegistration(teamId: number): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "teams/" + teamId + "/cancel", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  sendKassRequest(gsm: string, teamId: number) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "payments/kass/" + gsm + "/" + teamId, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  sendAurRequest(gsm: string, teamId: number) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "payments/aur/" + gsm + "/" + teamId, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  sendDepositRequest(teamId: number) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "payments/deposit/" + teamId, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  completeDeposit(teamId: number) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "payments/deposit/" + teamId + "/complete", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  getTotalPlayerScoresByTypeAndYear(type: number, year: number): Observable<Response> {
    var result = this.http.get(this.apiUrl + "scores/" + type + "/total/" + year);
    var tmp = result.map(s => s.json());

    return tmp;
  }

  getTournamentPlayersScoresByTypeAndYear(type: number, year: number): Observable<Response> {
    var result = this.http.get(this.apiUrl + "scores/" + type + "/tournaments/" + year);
    var tmp = result.map(s => s.json());

    return tmp;
  }

  getRegistration(tournamentId: number, teamType: number): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "registrations/" + tournamentId + "/" + teamType, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  getTeamRegistrations(tournamentId: number, teamType: number): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "registrations/" + tournamentId + "/" + teamType + "/public", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  getTeamRegistration(tournamentId: number, teamType: number, teamId: number): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "registrations/" + tournamentId + "/" + teamType + "/" + teamId, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  assignDivision(teamId: number, division: number) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "teams/" + teamId + "/division/" + division, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  requestPasswordReset(playerId: string): Observable<Response> {
    var result = this.http.get(this.apiUrl + "players/" + playerId + "/requestresetpassword");
    var tmp = result.map(s => s.json());

    return tmp;
  }

  resetPassword(requestId: string): Observable<Response> {
    var result = this.http.get(this.apiUrl + "players/" + requestId + "/resetpassword");
    var tmp = result.map(s => s.json());

    return tmp;
  }

  canPay(teamId: number, payingPlayerId: string): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "payments/" + teamId + "/canpay/" + payingPlayerId, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  verifyPayment(teamId: number): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "payments/" + teamId + "/verify", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  getGroups(tournamentId: number, teamTypeId: number, division: number, groupRule: number): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "registrations/" + tournamentId + "/" + teamTypeId + "/" + division + "/" + groupRule + "/calculate_groups", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  getFinals(tournamentId: number, teamTypeId: number, division: number, groupRule: number, finalsGroupRule: number): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "registrations/" + tournamentId + "/" + teamTypeId + "/" + division + "/" + groupRule + "/" + finalsGroupRule + "/calculate_finals", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  calculateMatches(group: GroupModel): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.post(this.apiUrl + "matches/calculate", group, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  confirmMatchList(groups: GroupModel[], finals?: DivisionMatch[]): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.post(this.apiUrl + "matches/confirm", { groups: groups, finals: finals }, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  getMatches(tournamentId: number, teamType?: number, division?: number): Observable<Response> {

    var tmp = null;
    if (teamType != null && division != null) {
      var result = this.http.get(this.apiUrl + "matches/" + tournamentId + "/" + teamType + "/" + division);
      tmp = result.map(s => s.json());
    } else {
      var result = this.http.get(this.apiUrl + "matches/" + tournamentId);
      tmp = result.map(s => s.json());
    }

    return tmp;
  }

  cancelMatch(match: DivisionMatch): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.post(this.apiUrl + "matches/cancel", match, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  scheduleMatch(match: DivisionMatch): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.post(this.apiUrl + "matches/schedule", match, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  deleteMatches(tournamentId: number, teamType: number, division: number): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "matches/" + tournamentId + "/" + teamType + "/" + division + "/delete", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  };

  getScoreSheets(tournamentId: number, teamTypeId: number, division: number) {
    return this.http.get(this.apiUrl + "matches/" + tournamentId + "/" + teamTypeId + "/" + division + "/scoresheets", { responseType: ResponseContentType.Blob }).map(response =>
      (<Response>response).blob());
  };

  startTournament(tournamentId: number): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "tournaments/" + tournamentId + "/start", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  };

  endTournament(tournamentId: number): Observable<Response> {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "tournaments/" + tournamentId + "/end", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  };

  getOngoingTournaments(): Observable<Response> {
    var result = this.http.get(this.apiUrl + "tournaments/ongoing");
    return result.map(s => s.json());
  }

  getDivisions(tournamentId: number, type: number): Observable<Response> {
    var result = this.http.get(this.apiUrl + "tournaments/" + tournamentId + "/divisions/" + type);
    return result.map(s => s.json());
  }

  getSimpleDivisionMatches(tournamentId: number, teamTypeId: number, division: number, divisionGroup: number): Observable<Response> {
    var result = this.http.get(this.apiUrl + "matches/" + tournamentId + "/" + teamTypeId + "/" + division + "/" + divisionGroup + "/matches");
    return result.map(s => s.json());
  }

  getMatchResult(round: number, team1Id: number, team2Id: number): Observable<Response> {
    var result = this.http.get(this.apiUrl + "matches/" + round + "/" + team1Id + "/" + team2Id + "/result");
    var tmp = result.map(s => s.json());

    return tmp;
  }

  getTeamById(teamId: number): Observable<Response> {
    var result = this.http.get(this.apiUrl + "teams/" + teamId);
    var tmp = result.map(s => s.json());

    return tmp;
  }

  sendResults(round: number, resultSet: SimpleDivisionMatchResult) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.post(this.apiUrl + "matches/" + round + "/set", resultSet, this.getAuthorizationRequestOption(data));
    var tmp = result.map((res: Response) => res.json());

    return tmp;
  }

  getDivisionGroupTable(tournamentId: number, teamTypeId: number, division: number, divisionGroup: number) {
    var result = this.http.get(this.apiUrl + "matches/" + tournamentId + "/" + teamTypeId + "/" + division + "/" + divisionGroup + "/table");
    var tmp = result.map(s => s.json());

    return tmp;
  }

  refreshPaymentStatus(teamId: number) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "payments/" + teamId + "/refresh", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  sendComment(teamId: number, comment: Comment) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.post(this.apiUrl + "comments/" + teamId, comment, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  getComments(teamId: number) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "comments/" + teamId, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  assignMatchSupport(match: SimpleDivisionMatch, support: Support) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.post(this.apiUrl + "matches/" + match.round + "/" + match.team1Id + "/" + match.team2Id + "/support", support, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  getPlayerDivisionAndGroup(personalId: string, tournamentId: number) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "tournaments/" + tournamentId + "/player/" + personalId + "/division_and_group", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  resolveMatchTeams(match: SimpleDivisionMatch) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "matches/" + match.templateTeam1Id + "/" + match.templateTeam2Id + "/" + match.round + "/resolve", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  resetMatchTeams(match: SimpleDivisionMatch) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "matches/" + match.templateTeam1Id + "/" + match.templateTeam2Id + "/" + match.round + "/reset", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  saveFinalTable(finalEntries: DivisionGroupEntry[]) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.post(this.apiUrl + "tournaments/save_results", finalEntries, this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }

  clearMatchResults(team1Id: number, team2Id: number, round: number) {
    var data: AuthData;
    data = <AuthData>this.load("authentication");

    var result = this.http.get(this.apiUrl + "matches/" + team1Id + "/" + team2Id + "/" + round + "/clear_results", this.getAuthorizationRequestOption(data));
    var tmp = result.map(s => s.json());

    return tmp;
  }
}
