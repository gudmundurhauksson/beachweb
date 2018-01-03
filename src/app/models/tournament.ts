import { BeachLocation } from "./beachlocation";

export class Tournament {
    id: number;
    name: string;
    locationId: number;
    description: string;
    date: string;
    isRegistrationOpen: boolean;
    type: number;

    location: BeachLocation;
}