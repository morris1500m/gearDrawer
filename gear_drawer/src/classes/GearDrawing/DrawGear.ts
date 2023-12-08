import { GearDimensions } from "../GearPropeties/GearDimensions";
import Point from "./Point";
import MakerJs from "makerjs";

export default class DrawGear {

    module: number;
    gearDimensions: GearDimensions;
    toothRoot: string;

    get pitchRadius() {return (this.gearDimensions.teethNumber * this.module)/2};
    get dendeumRadius() {return this.pitchRadius - this.gearDimensions.dedendumDepth * this.module};
    get andendumRadius() {return this.pitchRadius + this.gearDimensions.addendumHeight * this.module};

    get angleBetweenTeeth() {return 2* Math.PI / this.gearDimensions.teethNumber};
    get toothThickness() {return this.module*this.gearDimensions.toothThickness};
    get radiusOfAdendum() {return this.gearDimensions.addendumRadius*this.module};

    // Find point of tooth tip
    get toothTipPointOrigin() {return DrawGear.pointFromRadius(this.andendumRadius, this.thetaOrigin)};
    // Find intersection of max tooth thickness and pitch radius
    get angleBetweenToothFlankAndCentreLine() {return Math.asin((this.toothThickness/2)/this.pitchRadius)};

    get leftToothPitchCirclePointOrigin() {return DrawGear.pointFromRadius(this.pitchRadius, this.thetaOrigin + this.angleBetweenToothFlankAndCentreLine)};
    // Find intersection of dendeum & root 
    get rightToothDendeumPointOrigin() {return DrawGear.pointFromRadius(this.dendeumRadius, this.thetaOrigin + this.angleBetweenToothFlankAndCentreLine)}; 

    // Find centre of andendum radius  
    get centreOfAndendumLeftOrigin() {return DrawGear.findCentrePointOfArc(this.radiusOfAdendum, this.leftToothPitchCirclePointOrigin, this.toothTipPointOrigin)};  
    get topOfArc() {return DrawGear.addPoints(this.centreOfAndendumLeftOrigin, new Point(0, -this.radiusOfAdendum))};

    // angle between top of circle and tooth tip
    get toothTipAngleOffsetOrigin() {return DrawGear.getAngleBetweenToPointsOnCircle(this.topOfArc, this.toothTipPointOrigin, this.radiusOfAdendum)};
    // angle between tooth tip and intersection of max tooth thickness and pitch radius
    get toothTipAngleAndendumOrigin() {return DrawGear.getAngleBetweenToPointsOnCircle(this.toothTipPointOrigin, this.leftToothPitchCirclePointOrigin, this.radiusOfAdendum)}; 

    get startAdendumAngleOrigin() {return -this.toothTipAngleOffsetOrigin};
    get endAdendumAngleOrigin() {return this.startAdendumAngleOrigin-this.toothTipAngleAndendumOrigin};
    
    get startDendumAngleOrigin() {return this.angleBetweenToothFlankAndCentreLine};
    get endDendumAngleOrigin() {return this.angleBetweenTeeth - this.angleBetweenToothFlankAndCentreLine};

    // Shift first tooth to top  
    thetaOrigin =  Math.PI; 

    constructor(module: number, gearDimensions: GearDimensions, toothRoot: string) {
        this.module = module;
        this.gearDimensions = gearDimensions;
        this.toothRoot = toothRoot;
    }

    draw() {
        var centreOfAndendumLeft = DrawGear.rotatePoint(this.centreOfAndendumLeftOrigin, this.thetaOrigin);   
        var rightToothDendeumPoint = DrawGear.rotatePoint(this.rightToothDendeumPointOrigin, this.thetaOrigin);
        var leftToothPitchCirclePoint = DrawGear.rotatePoint(this.leftToothPitchCirclePointOrigin, this.thetaOrigin);
    
        var startAngle3 = this.endAdendumAngleOrigin + this.thetaOrigin - Math.PI/2;
        var endAngle3 = this.startAdendumAngleOrigin + this.thetaOrigin - Math.PI/2;

        var startAngle2 = -1 * this.endDendumAngleOrigin + this.thetaOrigin - Math.PI/2;
        var endAngle2 = -1 * this.startDendumAngleOrigin + this.thetaOrigin - Math.PI/2;

        var toothRootRadius = DrawGear.calculateRootToothRadius(this.dendeumRadius, this.angleBetweenTeeth, this.angleBetweenToothFlankAndCentreLine);

        var toothRootRadiusFromCentre = this.dendeumRadius + toothRootRadius;
        var toothRootRadiusCentre = DrawGear.pointFromRadius(toothRootRadiusFromCentre, this.angleBetweenTeeth/2);

        var test = DrawGear.calculateAngle(this.angleBetweenToothFlankAndCentreLine, this.angleBetweenTeeth/2, this.dendeumRadius + toothRootRadius);

        var angleTest = Math.asin((leftToothPitchCirclePoint.y - toothRootRadiusCentre.y)/toothRootRadius);

        var rootAngleStart = 180 - DrawGear.toDegrees(test);
        var rootAngleStart2 = 180 - DrawGear.toDegrees(angleTest) ;
        // ?????
        var rootAngleEnd = 270 - DrawGear.toDegrees(test);

        var testtest= DrawGear.movePointByVector(toothRootRadiusCentre, toothRootRadius, -Math.PI/2+ test);

        const rightFlankToToothTip = {type: 'arc', origin: [centreOfAndendumLeft.x, centreOfAndendumLeft.y],radius: this.radiusOfAdendum,startAngle: DrawGear.toDegrees(startAngle3),endAngle: DrawGear.toDegrees(endAngle3)};
        const rightRootArc = {type: 'arc', origin: [0, 0], radius: this.dendeumRadius, startAngle: DrawGear.toDegrees(startAngle2), endAngle: DrawGear.toDegrees(endAngle2)};
        const rightFlank = {type: 'line', origin: [rightToothDendeumPoint.x, rightToothDendeumPoint.y], end: [leftToothPitchCirclePoint.x, leftToothPitchCirclePoint.y] };

        const rightRoundFlank = {type: 'line', origin: [testtest.x, testtest.y], end: [leftToothPitchCirclePoint.x, leftToothPitchCirclePoint.y] };

        const rightArc = {type: 'arc', origin: [toothRootRadiusCentre.x, toothRootRadiusCentre.y],radius: toothRootRadius, startAngle: rootAngleStart, endAngle: rootAngleEnd};
        const rightArc2 = {type: 'arc', origin: [toothRootRadiusCentre.x, toothRootRadiusCentre.y],radius: toothRootRadius, startAngle: rootAngleStart2, endAngle: rootAngleEnd};
        
        const leftFlankToToothTip = MakerJs.path.mirror(rightFlankToToothTip, true, false);
        const leftRootArc = MakerJs.path.mirror(rightRootArc, true, false);
        const leftFlank = MakerJs.path.mirror(rightFlank, true, false);
        
        const leftRoundFlank = MakerJs.path.mirror(rightRoundFlank, true, false);
        const leftArc = MakerJs.path.mirror(rightArc, true, false);
        const leftArc2 = MakerJs.path.mirror(rightArc2, true, false);

        var gear:any = { models: {}, paths: {} };
        gear.units = MakerJs.unitType.Millimeter;
        
        for (var i = 0; i < this.gearDimensions.teethNumber; i++ ) {
            var pathObject: any;
            if (this.toothRoot === "square") {
                pathObject = {rightFlank, rightFlankToToothTip, rightRootArc,  leftFlank, leftFlankToToothTip, leftRootArc };
            } else  {
                if (this.pitchRadius <= toothRootRadiusFromCentre) {
                    pathObject = {rightArc2, rightFlankToToothTip, leftArc2, leftFlankToToothTip};
                } else {
                    pathObject = {rightArc, rightFlankToToothTip, rightRoundFlank, leftArc, leftFlankToToothTip, leftRoundFlank};
                }
            }
            var model = { paths: pathObject };
            var clone = MakerJs.cloneObject(model);
            var a = 360 / this.gearDimensions.teethNumber;
            MakerJs.model.rotate(clone, a * i, [0, 0]);
            gear.models[i] = clone;
        }

        return gear;
    }

    static calculateRootToothRadius(dendeumRadius: number, angleBetweenTeeth: number, angleBetweenToothFlankAndCentreLine: number) {
        var toothRootToNextTooth = angleBetweenTeeth/2-angleBetweenToothFlankAndCentreLine;
        return (dendeumRadius * (Math.sin(toothRootToNextTooth))/(1-Math.sin(toothRootToNextTooth)));
    }

    static calculateAngle(angleToFlank: number, angleToCentreline: number, radius: number) {
        var angle2 = Math.PI / 2 -angleToCentreline;
        var x1 = radius * Math.sin(angle2);
        var y1 = radius * Math.cos(angle2);

        var angle = Math.PI / 2 - angleToFlank;
        var x2 = radius * Math.sin(angle);
        var y2 = radius * Math.cos(angle);

        var yo = y1 - y2;
        var xa = x2 - x1;
         
        var result = Math.atan(xa/yo);
        return result;
    }

    static toDegrees(angle: number) {return angle * (180/Math.PI);}

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

    static movePointByVector(point: Point, magnitude: number, angle: number) {
        var x = point.x + magnitude * Math.sin(angle);  
        var y = point.y + magnitude * Math.cos(angle);
        return new Point(x,y); 
    }
}