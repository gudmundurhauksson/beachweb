import { Player } from "./player";
import { Team } from "./team";

export class Comment {
    id: number;
    player: Player;
    team: Team;
    text: string;
    date: string;
}