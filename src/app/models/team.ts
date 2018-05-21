import { Tournament } from "./tournament";
import { Player } from "./player";
import { PaymentStatus } from "./registration";

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
    score: number;
    paymentStatus: PaymentStatus;
}

export class SimpleTeam {
    id: number;
    player1: string;
    player2: string;
}