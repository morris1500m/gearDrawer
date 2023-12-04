import { GearDimensions } from "../GearPropeties/GearDimensions";
import Point from "./Point";
import DrawGearHelpers from "./DrawGearHelpers"
import MakerJs from "makerjs";

export default class DrawGear {

    static drawGear(module: number, gearDimensions: GearDimensions, toothRoot: string) {
        //console.log(toothRoot);

        //Create line element inside SVG
        var pitchRadius= (gearDimensions.teethNumber * module)/2;
        var dendeumRadius = pitchRadius - gearDimensions.dedendumDepth * module;
        var andendumRadius = pitchRadius + gearDimensions.addendumHeight * module;

        console.log("PitchRadius= "+pitchRadius);
        console.log("DendeumRadius= "+dendeumRadius);
        console.log("AndendumRadius= "+andendumRadius);
    
        var angleBetweenTeeth = 2* Math.PI / gearDimensions.teethNumber;
        var toothThickness = module*gearDimensions.toothThickness;
        var radiusOfAdendum = gearDimensions.addendumRadius*module;
    
        // Shift first tooth to top  
        var thetaOrigin =  Math.PI;  
        // Find point of tooth tip
        var toothTipPointOrigin = DrawGearHelpers.pointFromRadius(andendumRadius, thetaOrigin);
        
        // Find intersection of max tooth thickness and pitch radius
        var angleBetweenToothFlankAndCentreLine = Math.asin((toothThickness/2)/pitchRadius);
        //console.log("angleBetweenToothFlankAndCentreLine= "+this.toDegrees(angleBetweenToothFlankAndCentreLine));
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

        //for (let i = 0; i < gearDimensions.teethNumber; i++) {  
            for (let i = 0; i < 1; i++) {  
            // Find angle of centreline of tooth in radians
            var theta = angleBetweenTeeth * i + Math.PI; 

            var centreOfAndendumLeft = DrawGearHelpers.rotatePoint(centreOfAndendumLeftOrigin, theta);   
            var rightToothDendeumPoint = DrawGearHelpers.rotatePoint(rightToothDendeumPointOrigin, theta);
            var leftToothPitchCirclePoint = DrawGearHelpers.rotatePoint(leftToothPitchCirclePointOrigin, theta);
    
            var startAngle3 = endAdendumAngleOrigin + theta - Math.PI/2;
            console.log("startAngle3= "+this.toDegrees(startAngle3));
            var endAngle3 = startAdendumAngleOrigin + theta - Math.PI/2;
            console.log("endAngle3= "+this.toDegrees(endAngle3));

            var startAngle4 = -1 * (startAdendumAngleOrigin + theta) - Math.PI/2;
            console.log("startAngle4= "+this.toDegrees(startAngle4));
            var endAngle4 = -1 * (endAdendumAngleOrigin + theta) - Math.PI/2;
            console.log("endAngle4= "+this.toDegrees(endAngle4));

            const mirrorCentreOfAndendumLeft: Point = DrawGearHelpers.mirrorPointX(centreOfAndendumLeft);

            const rightFlankToToothTip = {type: 'arc', origin: [centreOfAndendumLeft.x, centreOfAndendumLeft.y],radius: radiusOfAdendum,startAngle: this.toDegrees(startAngle3),endAngle: this.toDegrees(endAngle3)}
            const leftFlankToToothTip = {type: 'arc', origin: [mirrorCentreOfAndendumLeft.x, mirrorCentreOfAndendumLeft.y],radius: radiusOfAdendum,startAngle: this.toDegrees(startAngle4),endAngle: this.toDegrees(endAngle4)}

            var startAngle1 = startDendumAngleOrigin + theta - Math.PI/2;
            console.log("startAngle1= "+this.toDegrees(startAngle1));
            var endAngle1 = endDendumAngleOrigin + theta - Math.PI/2;
            console.log("endAngle1= "+this.toDegrees(endAngle1));

            var startAngle2 = -1 * endDendumAngleOrigin + theta - Math.PI/2;
            console.log("startAngle2= "+this.toDegrees(startAngle2));
            var endAngle2 = -1 * startDendumAngleOrigin + theta - Math.PI/2;
            console.log("endAngle2= "+this.toDegrees(endAngle2));

            const leftRootArc = {type: 'arc', origin: [0, 0], radius: dendeumRadius, startAngle: this.toDegrees(startAngle1), endAngle: this.toDegrees(endAngle1)}
            const rightRootArc = {type: 'arc', origin: [0, 0], radius: dendeumRadius, startAngle: this.toDegrees(startAngle2), endAngle: this.toDegrees(endAngle2)}

            var leftToothDendeumPoint = rightToothDendeumPoint.MirrorPointX();
            var rightToothPitchCirclePoint = leftToothPitchCirclePoint.MirrorPointX();

            const rightFlank = {type: 'line', origin: [rightToothDendeumPoint.x, rightToothDendeumPoint.y], end: [leftToothPitchCirclePoint.x, leftToothPitchCirclePoint.y] };
            const leftFlank = {type: 'line', origin: [leftToothDendeumPoint.x, leftToothDendeumPoint.y], end: [rightToothPitchCirclePoint.x, rightToothPitchCirclePoint.y] };

            var toothRootToNextTooth = angleBetweenTeeth/2-angleBetweenToothFlankAndCentreLine;
            //console.log("toothRootToNextTooth= "+ this.toDegrees(toothRootToNextTooth));
            var toothRootRadius = (dendeumRadius * (Math.sin(toothRootToNextTooth))/(1-Math.sin(toothRootToNextTooth)));
            console.log("toothRootRadius= "+ toothRootRadius);

            console.log("angleBetweenToothFlankAndCentreLine= "+ this.toDegrees(angleBetweenToothFlankAndCentreLine));
            console.log("theta= "+ theta);
            

            var toothRootRadiusFromCentre = dendeumRadius + toothRootRadius;

            var bvcbcvbc = DrawGearHelpers.pointFromRadius(toothRootRadiusFromCentre, angleBetweenTeeth/2);
            console.log("bvcbcvbc= "+JSON.stringify(bvcbcvbc));
            console.log("theta= "+ this.toDegrees(theta));
            var toothRootRadiusCentre = DrawGearHelpers.pointFromRadius(toothRootRadiusFromCentre, angleBetweenTeeth/2);
            console.log("toothRootRadiusCentre= "+JSON.stringify(toothRootRadiusCentre));
            var toothRoodRadiusLeftCentre = DrawGearHelpers.mirrorPointX(toothRootRadiusCentre);
            //const testArc = {type: 'arc', origin: [toothRootRadiusCentre.x, toothRootRadiusCentre.y],radius: toothRootRadius, startAngle: 0, endAngle: 360};

            //const point = {type: 'circle', origin: [test68.x, test68.y], radius: 1};
            const point2 = {type: 'circle', origin: [toothRootRadiusCentre.x, toothRootRadiusCentre.y], radius: 1};

            var test = this.calculateAngle(angleBetweenToothFlankAndCentreLine, angleBetweenTeeth/2, dendeumRadius + toothRootRadius);

            var rootAngleStart = 180 - this.toDegrees(test);
            var rootAngleEnd = 180 + this.toDegrees(angleBetweenTeeth);

            var testtest= DrawGearHelpers.movePointByVector(toothRootRadiusCentre, toothRootRadius, -Math.PI/2+ test);
            const point3 = {type: 'circle', origin: [testtest.x, testtest.y], radius: 1};

            var test67 = DrawGearHelpers.rotatePoint(DrawGearHelpers.movePointByVector(rightToothDendeumPointOrigin,-toothRootRadius,angleBetweenToothFlankAndCentreLine), theta);
            var test68 = DrawGearHelpers.mirrorPointX(test67);
            const testFlank = {type: 'line', origin: [testtest.x, testtest.y], end: [leftToothPitchCirclePoint.x, leftToothPitchCirclePoint.y] };
            const leftFlankRound = {type: 'line', origin: [test68.x, test68.y], end: [rightToothPitchCirclePoint.x, rightToothPitchCirclePoint.y] };

            console.log("rootAngleStart= " + rootAngleStart);
            console.log("rootAngleEnd= " + rootAngleEnd);

            const testArc = {type: 'arc', origin: [toothRootRadiusCentre.x, toothRootRadiusCentre.y],radius: toothRootRadius, startAngle: rootAngleStart, endAngle: rootAngleEnd};
            const testLeftArc = {type: 'arc', origin: [toothRoodRadiusLeftCentre.x, toothRoodRadiusLeftCentre.y],radius: toothRootRadius, startAngle: 270+this.toDegrees(angleBetweenTeeth/2 - theta), endAngle: this.toDegrees(angleBetweenTeeth/2 - theta)};

            //paths.push(makerLine1, makerLine2, makerArc1, makerArc2, makerArc3, makerArc4);
            if (toothRoot === "square") {
                paths.push(leftFlank, leftFlankToToothTip, leftRootArc, rightFlank, rightFlankToToothTip, rightRootArc);
            } else {
                paths.push(leftFlankToToothTip, testArc, rightFlankToToothTip, testLeftArc, leftFlankRound, testFlank, point2, rightRootArc, leftRootArc, point3);
            }
        }

        var gear:any = { models: {}, paths: {} };
        gear.units = MakerJs.unitType.Millimeter;

        paths.forEach((path, index) => { 
            gear.paths[index] = path; 
        });

        return gear;
    }

    static calculateAngle(angleToFlank: number, angleToCentreline: number, radius: number) {
        console.log("radius= "+ radius);
        console.log("angleToFlankt= "+ this.toDegrees(angleToFlank));
        console.log("angleToCentreline= "+ this.toDegrees(angleToCentreline));
        var angle2 = Math.PI / 2 -angleToCentreline;
        var x1 = radius * Math.sin(angle2);
        console.log("x1= " + x1);
        var y1 = radius * Math.cos(angle2);
        console.log("y1= " + y1);

        var angle = Math.PI / 2 - angleToFlank;
        var x2 = radius * Math.sin(angle);
        console.log("x2= " + x2);
        var y2 = radius * Math.cos(angle);
        console.log("y2= " + y2);

        var yo = y1 - y2;
        console.log("yo= " + yo);
        var xa = x2 - x1;
        console.log("xa= " + xa);
         
        var result = Math.atan(xa/yo);
        console.log("angle result= "+ this.toDegrees(result));

        return result;
    }

    static toDegrees(angle: number) {return angle * (180/Math.PI);}
}