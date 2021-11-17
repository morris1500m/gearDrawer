import Point from "./Point";

export default class Arc {
    startAngle: number;
    endAngle: number;
    radius: number;
    centrePoint: Point; 
    
    constructor(radius: number, centrePoint: Point, startAngle: number, endAngle: number){
        this.startAngle= startAngle;
        this.endAngle= endAngle;
        this.radius= radius;
        this.centrePoint= centrePoint;
    }
}