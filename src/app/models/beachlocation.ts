import { Court } from "./court";

export class BeachLocation {
    id: number;
    name: string;
    description: string;
    courts: Court[];
    gps: string;
    address: string;
    website: string;
}