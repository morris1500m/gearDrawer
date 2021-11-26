import { GearDimensions } from "../GearPropeties/GearDimensions";
import Point from "./Point";
import DrawGearHelpers from "./DrawGearHelpers"
import MakerJs from "makerjs";

export default class DrawGear {

    static drawGear(module: number, gearDimensions: GearDimensions) {
        //Create line element inside SVG
        var pitchRadius= (gearDimensions.teethNumber * module)/2;
        var dendeumRadius = pitchRadius - gearDimensions.dedendumDepth * module ;
        var andendumRadius = pitchRadius + gearDimensions.addendumHeight * module;
    
        var angleBetweenTeeth = 2* Math.PI / gearDimensions.teethNumber;
        var toothThickness = module*gearDimensions.toothThickness;
        var radiusOfAdendum = gearDimensions.addendumRadius*module;
    
        // Shift first tooth to top  
        var thetaOrigin =  Math.PI;  
        // Find point of tooth tip
        var toothTipPointOrigin = DrawGearHelpers.pointFromRadius(andendumRadius, thetaOrigin);
        
        // Find intersection of max tooth thickness and pitch radius
        var angleBetweenToothFlankAndCentreLine = Math.asin((toothThickness/2)/pitchRadius);
        var leftToothPitchCirclePointOrigin = DrawGearHelpers.pointFromRadius(pitchRadius, thetaOrigin + angleBetweenToothFlankAndCentreLine);
    
        // Find intersection of dendeum & root
        var rightToothDendeumPointOrigin = DrawGearHelpers.pointFromRadius(dendeumRadius, thetaOrigin + angleBetweenToothFlankAndCentreLine);  
    
        // Find centre of andendum radius  
        var centreOfAndendumLeftOrigin = DrawGearHelpers.findCentrePointOfArc(radiusOfAdendum, leftToothPitchCirclePointOrigin, toothTipPointOrigin);  
        var topOfArc = DrawGearHelpers.addPoints(centreOfAndendumLeftOrigin, new Point(0, -radiusOfAdendum));
    
        // angle between top of circle and tooth tip
        var toothTipAngleOffsetOrigin = DrawGearHelpers.getAngleBetweenToPointsOnCircle(topOfArc, toothTipPointOrigin, radiusOfAdendum);
        // angle between tooth tip and intersection of max tooth thickness and pitch radius
        var toothTipAngleAndendumOrigin = DrawGearHelpers.getAngleBetweenToPointsOnCircle(toothTipPointOrigin, leftToothPitchCirclePointOrigin, radiusOfAdendum); 
    
        var startAdendumAngleOrigin = -toothTipAngleOffsetOrigin;
        var endAdendumAngleOrigin = startAdendumAngleOrigin-toothTipAngleAndendumOrigin;
    
        var startDendumAngleOrigin = angleBetweenToothFlankAndCentreLine;
        var endDendumAngleOrigin = angleBetweenTeeth - angleBetweenToothFlankAndCentreLine;

        var paths = [];

        for (let i = 0; i < gearDimensions.teethNumber; i++) {  
            // Find angle of centreline of tooth in radians
            var theta = angleBetweenTeeth * i + Math.PI; 

            var centreOfAndendumLeft = DrawGearHelpers.rotatePoint(centreOfAndendumLeftOrigin, theta);   
            var rightToothDendeumPoint = DrawGearHelpers.rotatePoint(rightToothDendeumPointOrigin, theta);
            var leftToothPitchCirclePoint = DrawGearHelpers.rotatePoint(leftToothPitchCirclePointOrigin, theta);
    
            var startAngle3 = endAdendumAngleOrigin + theta - Math.PI/2;
            var endAngle3 = startAdendumAngleOrigin + theta - Math.PI/2;

            var startAngle4 = -1*(startAdendumAngleOrigin + theta) - Math.PI/2;
            var endAngle4 = -1*(endAdendumAngleOrigin + theta) - Math.PI/2;

            const mirrorCentreOfAndendumLeft: Point = DrawGearHelpers.mirrorPointX(centreOfAndendumLeft);

            const makerArc1 = {type: 'arc', origin: [centreOfAndendumLeft.x, centreOfAndendumLeft.y],radius: radiusOfAdendum,startAngle: this.toDegrees(startAngle3),endAngle: this.toDegrees(endAngle3)}
            const makerArc2 = {type: 'arc', origin: [mirrorCentreOfAndendumLeft.x, mirrorCentreOfAndendumLeft.y],radius: radiusOfAdendum,startAngle: this.toDegrees(startAngle4),endAngle: this.toDegrees(endAngle4)}

            var startAngle1 = startDendumAngleOrigin + theta - Math.PI/2;
            var endAngle1 = endDendumAngleOrigin+ theta - Math.PI/2;

            var startAngle2 = -1*endDendumAngleOrigin+ theta - Math.PI/2;
            var endAngle2 = -1*startDendumAngleOrigin+ theta - Math.PI/2;

            const makerArc3 = {type: 'arc', origin: [0, 0],radius: dendeumRadius,startAngle: this.toDegrees(startAngle1),endAngle: this.toDegrees(endAngle1)}
            const makerArc4 = {type: 'arc', origin: [0, 0],radius: dendeumRadius,startAngle: this.toDegrees(startAngle2),endAngle: this.toDegrees(endAngle2)}

            var leftToothDendeumPoint = rightToothDendeumPoint.MirrorPointX();
            var rightToothPitchCirclePoint = leftToothPitchCirclePoint.MirrorPointX();

            const makerLine1 = {type: 'line', origin: [rightToothDendeumPoint.x, rightToothDendeumPoint.y], end: [leftToothPitchCirclePoint.x, leftToothPitchCirclePoint.y] };
            const makerLine2 = {type: 'line', origin: [leftToothDendeumPoint.x, leftToothDendeumPoint.y], end: [rightToothPitchCirclePoint.x, rightToothPitchCirclePoint.y] };

            paths.push(makerLine1, makerLine2, makerArc1, makerArc2, makerArc3, makerArc4);
        }

        var gear:any = { models: {}, paths: {} };
        gear.units = MakerJs.unitType.Millimeter;

        paths.forEach((path, index) => { 
            gear.paths[index] = path; 
        });

        return gear;
    }

    static toDegrees(angle: number) {return angle * (180/Math.PI);}
}