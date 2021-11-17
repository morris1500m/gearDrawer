import Point from "./Point";

export default class Line {
    startPoint: Point;
    endPoint: Point;
    
    constructor(startPoint: Point, endPoint: Point){
        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }
}