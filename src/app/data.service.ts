import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Player } from './models/player';
import { CookieService } from 'angular2-cookie/core';
import { AuthData } from './models/authdata';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';

@Injectable()
export class DataService {

  private goals = new BehaviorSubject<any>(['The initial goal', 'Another silly life goal']);
  goal = this.goals.asObservable();

  private baseUrl ="http://localhost:3564/"; 
  private apiUrl = this.baseUrl + "api/";

  constructor(private http: Http, private _cookieService: CookieService) { 
    console.log("data service");
  }

  changeGoal(goal) {
    this.goals.next(goal)
  }

  register(player: Player): Observable<Response> {
    console.log("registering");
    var result = this.http.post(this.apiUrl + "players", player);
    var tmp = result.map((res: Response) => res.json());
    return tmp;
  }

  login(player: Player) : Observable<Response> {
    var result = this.http.post(this.baseUrl + "token", "grant_type=password&username=" + player.email + "&password=" + player.password);
    var tmp = result.map((res: Response) => res.json());
    return tmp;
  }

  save(key: string, content: Object) {
    this._cookieService.putObject(key, content);
  }

  load(key: string) : Object {
    return this._cookieService.getObject(key);
  }

  clear(key: string) : void {
    this._cookieService.remove(key);
  }

  verifyLogin(auth: AuthData) : Observable<Response> {
    var result = this.http.get(this.apiUrl + "players/loggedin", this.getAuthorizationRequestOption(auth));
    var tmp = result.map((player: Response) => player.json());
    return tmp;
  }

  getAuthorizationRequestOption(auth: AuthData): RequestOptions {
    let header = new Headers();
    header.append("Authorization", "Bearer " + auth.access_token);
    let options = new RequestOptions({headers: header});
    return options;
  }


}
