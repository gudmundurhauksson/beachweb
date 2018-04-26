import { DivisionMatch } from "./divisionMatch";

export class TimeSlot {
    time: string;    
    date: string;
    day: string;
    names: Array<TimeSlotName>;
    slot: number;    
    next: TimeSlot;
}

export class TimeSlotName {
    courtId: number;
    match: DivisionMatch;
    time: string;
    date: string;
}

export class DateVisibility {
    buttonIndex: number;
    isVisible: boolean;

    /**
     *
     */
    constructor(isVisible: boolean, buttonIndex: number) {
        this.isVisible = isVisible;
        this.buttonIndex = buttonIndex;
    }
}