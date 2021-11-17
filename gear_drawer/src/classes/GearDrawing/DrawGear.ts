import { GearDimensions } from "../GearPropeties/GearDimensions";
import Point from "./Point";
import DrawGearHelpers from "./DrawGearHelpers"
import Arc from "./Arc"
import Line from "./Line"
import Gear from "./Gear";

export default class DrawGear {

    static drawGear(module: number, gearDimensions: GearDimensions) {
        //Create line element inside SVG
        var pitchRadius= (gearDimensions.teethNumber * module)/2;
        var dendeumRadius = pitchRadius - gearDimensions.dedendumDepth * module ;
        var andendumRadius = pitchRadius + gearDimensions.addendumHeight * module;
    
        var angleBetweenTeeth = 2* Math.PI / gearDimensions.teethNumber;
        var toothThickness = module*gearDimensions.toothThickness;
        var radiusOfAdendum = gearDimensions.addendumRadius*module;
        var originPoint = new Point(0,0);
    
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

        var listOfArcs: Arc[]=[];
        var listOfLines: Line[]=[];

        const CentrePoint: Point = new Point(150, 150);

        for (let i = 0; i < gearDimensions.teethNumber; i++){
            // Find angle of centreline of tooth in radians
            var theta = angleBetweenTeeth * i + Math.PI; 

            var centreOfAndendumLeft = DrawGearHelpers.rotatePoint(centreOfAndendumLeftOrigin, theta);   
            var rightToothDendeumPoint = DrawGearHelpers.rotatePoint(rightToothDendeumPointOrigin, theta);
            var leftToothPitchCirclePoint = DrawGearHelpers.rotatePoint(leftToothPitchCirclePointOrigin, theta);
    
            listOfArcs.push(new Arc(radiusOfAdendum, centreOfAndendumLeft.AddPoint(CentrePoint), startAdendumAngleOrigin + theta, endAdendumAngleOrigin + theta));
            listOfArcs.push(new Arc(radiusOfAdendum, DrawGearHelpers.mirrorPointX(centreOfAndendumLeft).AddPoint(CentrePoint), -1*startAdendumAngleOrigin - theta, -1*endAdendumAngleOrigin - theta));
            listOfArcs.push(new Arc(dendeumRadius, originPoint.AddPoint(CentrePoint), endDendumAngleOrigin+ theta, startDendumAngleOrigin+ theta));
            listOfArcs.push(new Arc(dendeumRadius, originPoint.AddPoint(CentrePoint), -1*endDendumAngleOrigin+ theta, -1*startDendumAngleOrigin+ theta));

            var leftToothDendeumPoint = rightToothDendeumPoint.MirrorPointX();
            var rightToothPitchCirclePoint = leftToothPitchCirclePoint.MirrorPointX();
            listOfLines.push(new Line(rightToothDendeumPoint.AddPoint(CentrePoint), leftToothPitchCirclePoint.AddPoint(CentrePoint)));
            listOfLines.push(new Line(leftToothDendeumPoint.AddPoint(CentrePoint), rightToothPitchCirclePoint.AddPoint(CentrePoint)));
        }
        return new Gear(listOfArcs, listOfLines);
    }
}

//this.drawArc(radiusOfAdendum, centreOfAndendumLeft, startAdendumAngleOrigin + theta, endAdendumAngleOrigin + theta); 
//this.drawArc(radiusOfAdendum, DrawGearHelpers.mirrorPointX(centreOfAndendumLeft), -1*startAdendumAngleOrigin - theta, -1*endAdendumAngleOrigin - theta); 
//this.drawArc(dendeumRadius, originPoint, endDendumAngleOrigin+ theta, startDendumAngleOrigin+ theta);  
//this.drawArc(dendeumRadius, originPoint, -1*endDendumAngleOrigin+ theta, -1*startDendumAngleOrigin+ theta);    
    
//this.drawLine(rightToothDendeumPoint, leftToothPitchCirclePoint);
//this.drawLine(DrawGearHelpers.mirrorPointX(rightToothDendeumPoint), DrawGearHelpers.mirrorPointX(leftToothPitchCirclePoint));