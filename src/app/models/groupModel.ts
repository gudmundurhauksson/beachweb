import { ArrangeMatchesComponent } from "../arrange-matches/arrange-matches.component";
import { Match } from "./match";

export class GroupModel {
    name: string;    
    divisionGroup: number;
    teamIds: Array<number>;
    matches: Array<Match>;
}