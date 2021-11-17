export default class Point {
    x: number;
    y: number; 
    
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    AddPoint(pointToAdd: Point){
        return new Point(this.x + pointToAdd.x, this.y + pointToAdd.y);
    }

    MirrorPointX(){
        return new Point(this.x*-1, this.y);
    }
}