export class DivisionGroupTable {
    entries: DivisionGroupEntry[];
}

export class DivisionGroupEntry {
    teamId: number;
    name: string;
    playedMatched: number;
    setsWon: number;
    setsLost: number;
    wonMatches: number;
    pointsFor: number;
    pointsAgainst: number;
    ratioWon: number;
    ratioPoints: number;
}