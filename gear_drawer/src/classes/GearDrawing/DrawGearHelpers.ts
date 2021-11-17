import Point from "./Point";

export default class DrawGearHelpers {
    static pointFromRadius(radius: number, angle: number){
        var x = radius * Math.sin(angle);  
        var y = radius * Math.cos(angle);
        return new Point(x,y); 
    }

    static addPoints(point1: Point, point2: Point) {
        return new Point(point1.x+point2.x, point1.y+point2.y);
    }

    static mirrorPointX(point: Point){
        return new Point(point.x*-1, point.y);
    }

    static findCentrePointOfArc(radius: number, start: Point, end: Point, clockwise = true){
        var distance = Math.sqrt(Math.pow((start.x-end.x), 2)+Math.pow((start.y-end.y),2));
    
        var firstTermX= (start.x + end.x)/2;
        var firstTermY= (start.y + end.y)/2;
    
        var secondTermX= (start.y - end.y)/2;
        var secondTermY= (start.x - end.x)/2;
    
        var thirdTerm=Math.sqrt(Math.pow(((2*radius)/distance),2)-1);
    
        var x;
        var y;
    
        if (clockwise) {
            x= firstTermX + secondTermX * thirdTerm;
            y= firstTermY - secondTermY * thirdTerm;
        } else {
            x= firstTermX - secondTermX * thirdTerm;
            y= firstTermY + secondTermY * thirdTerm;
        }
    
        return new Point(x,y);
    }

    static calcChordLength(point1: Point, point2: Point){
        return Math.sqrt(Math.pow((point1.x-point2.x), 2)+Math.pow((point1.y-point2.y),2));
    }

    static getAngleBetweenToPointsOnCircle(point1: Point, point2: Point, radius: number){
        var chordLength = this.calcChordLength(point1, point2);
        return 2* Math.asin(chordLength/(2*radius));
    }

    static rotatePoint(point: Point, angleRad: number){
        var x = point.x * Math.cos(angleRad) - point.y * Math.sin(angleRad);
        var y = point.y * Math.cos(angleRad) + point.x * Math.sin(angleRad);
        return new Point(x,y);
    }
}