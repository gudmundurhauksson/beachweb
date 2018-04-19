import { Team } from "./team";

export class DivisionMatch {
    division: number;
    tournamentId: number;
    type: number;
    date: string;
    time: string;
    team1: Team;
    team2: Team;
}