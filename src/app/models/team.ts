import { Tournament } from "./tournament";
import { Player } from "./player";

export class Team {
    id: number;
    player1Id: string;
    player2Id: string;
    tournamentId: number;
    teamTypeId: number;
    payment: string;

    tournament: Tournament;
    player1: Player;
    player2: Player;
}