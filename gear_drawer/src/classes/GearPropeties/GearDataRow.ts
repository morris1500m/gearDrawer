import { GearData } from './GearData';

export class GearDataRow {
    gearRatio: number;
    gearData: GearData[];

    constructor(gearRatio: number, gearData: GearData[]){
        this.gearData = gearData;
        this.gearRatio = gearRatio;
    }
}