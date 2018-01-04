import { Tournament } from "./tournament";

export class Team {
    id: string;
    player1Id: string;
    player2Id: string;
    tournamentId: number;
    teamTypeId: number;
    payment: string;

    tournament: Tournament;
}