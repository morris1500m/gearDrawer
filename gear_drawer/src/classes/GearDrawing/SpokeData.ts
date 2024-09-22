import { SpokeType } from "../../enums/SpokeType";

export default class SpokeData {
    spokeType: SpokeType;
    spokeNumber: number;
    innerRimRadius: number;
    outerRimRadius: number;
    spokeThickness: number;
    spokeAngle: number;

    constructor(spokeType: SpokeType, spokeNumber: number, innerRimRadius: number, outerRimRadius: number, spokeThickness: number, spokeAngle?:number){
        this.spokeType = spokeType;
        this.spokeNumber = spokeNumber;
        this.innerRimRadius = innerRimRadius;
        this.outerRimRadius = outerRimRadius;
        this.spokeThickness = spokeThickness;
        this.spokeAngle= spokeAngle ?? 0;
    }
}