import { BeachLocation } from "./beachlocation";

export class Tournament {
    id: number;
    name: string;
    locationId: number;
    description: string;
    date: string;
    isRegistrationOpen: boolean;
    type: number;
    price: string;
    isStarted: boolean;
    location: BeachLocation;
    dateTicks: number;    
    unixDateTicks: number;
    year: number;
    isOngoing: boolean;
    days: number;
    bankAccountId: string;
    emailHost: string;
}