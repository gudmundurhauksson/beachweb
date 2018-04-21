import { DivisionMatch } from "./divisionMatch";

export class TimeSlot {
    time: string;    
    date: string;
    day: string;
    names: Array<TimeSlotName>;
    slot: number;    
}

export class TimeSlotName {
    courtId: number;
    match: DivisionMatch;
}