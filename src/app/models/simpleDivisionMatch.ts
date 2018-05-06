import { SimpleDivisionMatchResult } from "./simpleDivisionMatchResult";

export class SimpleDivisionMatch {
    date: string;
    team1Id: number;
    team2Id: number;
    tournamentId: number;
    division: number;
    divisionGroup: number;
    team1: string;
    team2: string;
    courtName: string;
    teamTypeId: number;
    round: number;
    results: SimpleDivisionMatchResult[];
}