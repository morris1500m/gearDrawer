class Point {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

var width = 750;
var height = 750;

var centreX = width/2;
var centreY = height/2;

function addPoints(point1,point2) {
    return new Point(point1.x+point2.x, point1.y+point2.y);
}

function pointFromRadius(radius, angle){
    var x = radius * Math.sin(angle);  
    var y = radius * Math.cos(angle);
    return new Point(x,y); 
}

function logPoint(point, pointName){
    console.log(pointName+", x: "+ point.x+", y: "+point.y);
}

function logRadianAngle(angle, angleName){
    console.log(angleName+", rad: "+angle+", degrees: "+(180*angle/Math.PI));
}

function mirrorPointX(point){
    return new Point(point.x*-1, point.y);
}

function drawGear(svg, teethNum) {
    //Create line element inside SVG
    var lineLength = 250; 
    for (let i = 0; i< teethNum; i++) {
        var theta = ((360 / teethNum) * i)*(Math.PI/180); 
        var x2 = lineLength * Math.sin(theta);
        var y2 = lineLength * Math.cos(theta);
        console.log("i= "+i+", theta= "+theta+", x2= "+x2+", y2= "+y2);
        svg.append("line")
           .attr("x1", centreX)
           .attr("x2", centreX+x2)
           .attr("y1", centreY)
           .attr("y2", centreY+y2)
           .attr("stroke", "black");
    }
}

function findCentrePointOfArc(radius, start, end, clockwise = true){
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

function calcChordLength(point1,point2){
    return Math.sqrt(Math.pow((point1.x-point2.x), 2)+Math.pow((point1.y-point2.y),2));
}

function getAngleBetweenToPointsOnCircle(point1,point2, radius){
    var chordLength = calcChordLength(point1, point2);
    return 2* Math.asin(chordLength/(2*radius));
}

function rotatePoint(point, angleRad){
    var x = point.x * Math.cos(angleRad) - point.y * Math.sin(angleRad);
    var y = point.y * Math.cos(angleRad) + point.x * Math.sin(angleRad);
    return new Point(x,y);
}

function drawPoint(point, colour){
    svg.append('circle')
        .attr('cx', centreX+point.x)
        .attr('cy', centreY+point.y)
        .attr('r', 5)
        .style('fill', colour);  
}

function drawLine(point1, point2, colour = "black"){
    svg.append("line")
        .attr("x1", centreX+point1.x)
        .attr("x2", centreX+point2.x)
        .attr("y1", centreY+point1.y)
        .attr("y2", centreY+point2.y)
        .attr("stroke", colour); 
}

  function drawArc(radius, centrePoint, startAngle, endAngle){
      var arc = d3.arc()
        .innerRadius(radius)
        .outerRadius(radius)
        .startAngle(startAngle)
        .endAngle(endAngle)

    svg.append("path")
        .attr("d", arc)
        .attr("transform", "translate("+(centreX+centrePoint.x)+","+(centreY+ centrePoint.y)+")")
        .attr("fill", "none")
        .attr("stroke", "black"); 
  }

function drawGear(teethNum, module, hf, ha, s, p) {
    //Create line element inside SVG
    var pitchRadius= (teethNum * module)/2;
    var dendeumRadius = pitchRadius - hf * module ;
    var andendumRadius = pitchRadius + ha * module;

    var angleBetweenTeeth = 2* Math.PI / teethNum;
    var toothThickness = module*s;
    var radiusOfAdendum = p*module;
    var originPoint = new Point(0,0);

    // Shift first tooth to top  
    var thetaOrigin =  Math.PI;  
    // Find point of tooth tip
    var toothTipPointOrigin = pointFromRadius(andendumRadius, thetaOrigin);
    
    // Find intersection of max tooth thickness and pitch radius
    var angleBetweenToothFlankAndCentreLine = Math.asin((toothThickness/2)/pitchRadius);
    var leftToothPitchCirclePointOrigin = pointFromRadius(pitchRadius, thetaOrigin + angleBetweenToothFlankAndCentreLine);

    // Find intersection of dendeum & root
    var rightToothDendeumPointOrigin = pointFromRadius(dendeumRadius, thetaOrigin + angleBetweenToothFlankAndCentreLine);  

    // Find centre of andendum radius  
    var centreOfAndendumLeftOrigin = findCentrePointOfArc(radiusOfAdendum, leftToothPitchCirclePointOrigin, toothTipPointOrigin);  
    var topOfArc = addPoints(centreOfAndendumLeftOrigin, new Point(0, -radiusOfAdendum));

    // angle between top of circle and tooth tip
    var toothTipAngleOffsetOrigin = getAngleBetweenToPointsOnCircle(topOfArc, toothTipPointOrigin, radiusOfAdendum);
    // angle between tooth tip and intersection of max tooth thickness and pitch radius
    var toothTipAngleAndendumOrigin = getAngleBetweenToPointsOnCircle(toothTipPointOrigin, leftToothPitchCirclePointOrigin, radiusOfAdendum); 

    var startAdendumAngleOrigin = -toothTipAngleOffsetOrigin;
    var endAdendumAngleOrigin = startAdendumAngleOrigin-toothTipAngleAndendumOrigin;

    var startDendumAngleOrigin = angleBetweenToothFlankAndCentreLine;
    var endDendumAngleOrigin = angleBetweenTeeth - angleBetweenToothFlankAndCentreLine;

    for (let i = 0; i< teethNum; i++){
        // Find angle of centreline of tooth in radians
        var theta = angleBetweenTeeth * i + Math.PI; 

        var centreOfAndendumLeft = rotatePoint(centreOfAndendumLeftOrigin, theta);   
        var rightToothDendeumPoint = rotatePoint(rightToothDendeumPointOrigin, theta);
        var leftToothPitchCirclePoint = rotatePoint(leftToothPitchCirclePointOrigin, theta);

        drawArc(radiusOfAdendum, centreOfAndendumLeft, startAdendumAngleOrigin + theta, endAdendumAngleOrigin + theta); 
        drawArc(radiusOfAdendum, mirrorPointX(centreOfAndendumLeft), -1*startAdendumAngleOrigin - theta, -1*endAdendumAngleOrigin - theta); 
        drawArc(dendeumRadius, originPoint, endDendumAngleOrigin+ theta, startDendumAngleOrigin+ theta);  
        drawArc(dendeumRadius, originPoint, -1*endDendumAngleOrigin+ theta, -1*startDendumAngleOrigin+ theta);    

        drawLine(rightToothDendeumPoint, leftToothPitchCirclePoint);
        drawLine(mirrorPointX(rightToothDendeumPoint), mirrorPointX(leftToothPitchCirclePoint));
    }
}

function drawCircle(svg, diameter) {
    //Append circle 
    svg.append("circle")
       .attr("cx", centreX)
       .attr("cy", centreY)
       .attr("r", diameter/2)
       .attr('fill', 'none')
       .attr("stroke", "black");
}

function drawCycloidalGear(teethNumber, gearModule){
    var s= 1.41;
    var hf= 1.75;
    var ha;
    var p;

    if (teethNumber<8){

    } else if (teethNumber==8) {
        ha = 1.16;
        p = 1.85;
    } else if (teethNumber==9) {
        ha = 1.17;
        p = 1.87;
    } else if (teethNumber >= 10 && teethNumber <= 11) {
        ha = 1.19;
        p = 1.90;
    } else if (teethNumber >= 12 && teethNumber <= 13) {
        ha = 1.20;
        p = 1.92;
    } else if (teethNumber >= 14 && teethNumber <= 16) {
        ha = 1.22;
        p = 1.95;
    } else if (teethNumber >= 17 && teethNumber <= 20) {
        ha = 1.24;
        p = 1.98;
    } else if (teethNumber >= 21 && teethNumber <= 25) {
        ha = 1.26;
        p = 2.01;
    } else if (teethNumber >= 26 && teethNumber <= 34) {
        ha = 1.27;
        p = 2.03;
    } else if (teethNumber >= 35 && teethNumber <= 54) {
        ha = 1.29;
        p = 2.06;
    } else if (teethNumber >= 55 && teethNumber <= 134) {
        ha = 1.31;
        p = 2.09;
    } else {
        ha = 1.32;
        p = 2.11;
    }

    drawGear(teethNumber, gearModule, hf, ha, s, p);
}  

class GearData {
    constructor(ha, p, z){
        this.ha = ha;
        this.p = p;
        this.z = z;
    }
}

class GearDataRow {
    constructor(gearRatio, gearData){
        this.gearData = gearData;
        this.gearRatio = gearRatio;
    }
}

function drawEpicyclicWheel(pinionNumber, gearRatio, gearModule){
    var s= 1.57;
    var hf= 1.57;

    var z3= new GearDataRow(3, [new  GearData(1.259, 1.855, 6),new  GearData(1.335, 1.968, 7), new  GearData(1.403, 2.068, 8), new  GearData(1.465, 2.160, 9), new  GearData(1.523, 2.244, 10), new  GearData(1.626, 2.396, 12), new  GearData(1.718, 0, 14), new  GearData(1.760, 2.594, 15), new  GearData(1.801, 2.654, 16)]);
    var z4= new GearDataRow(4, [new  GearData(1.280, 1.886, 6),new  GearData(1.359, 2.003, 7), new  GearData(1.430, 2.107, 8), new  GearData(1.494, 2.202, 9), new  GearData(1.554, 2.290, 10), new  GearData(1.661, 2.448, 12), new  GearData(1.756, 0, 14), new  GearData(1.801, 2.654, 15), new  GearData(1.843, 2.715, 16)]);
    var z5= new GearDataRow(5, [new  GearData(1.293, 1.906, 6),new  GearData(1.374, 2.025, 7), new  GearData(1.447, 2.132, 8), new  GearData(1.513, 2.230, 9), new  GearData(1.574, 2.320, 10), new  GearData(1.684, 2.482, 12), new  GearData(1.782, 0, 14), new  GearData(1.827, 2.692, 15), new  GearData(1.870, 2.756, 16)]);

    var z6= new GearDataRow(6, [new  GearData(1.303, 1.920, 6),new  GearData(1.385, 2.041, 7), new  GearData(1.459, 2.150, 8), new  GearData(1.526, 2.249, 9), new  GearData(1.588, 2.341, 10), new  GearData(1.700, 2.505, 12), new  GearData(1.799, 0, 14), new  GearData(1.845, 2.719, 15), new  GearData(1.889, 2.784, 16)]);
    var z6_5= new GearDataRow(6.5, [new  GearData(1.307, 1.926, 6),new  GearData(1.389, 2.048, 7), new  GearData(1.464, 2.157, 8), new  GearData(1.531, 2.257, 9), new  GearData(1.594, 2.349, 10), new  GearData(1.707, 2.516, 12), new  GearData(1.807, 0, 14), new  GearData(1.853, 2.730, 15), new  GearData(1.897, 2.795, 16)]);
    var z7= new GearDataRow(7, [new  GearData(1.310, 1.930, 6),new  GearData(1.393, 2.053, 7), new  GearData(1.468, 2.163, 8), new  GearData(1.536, 2.263, 9), new  GearData(1.599, 2.356, 10), new  GearData(1.712, 2.523, 12), new  GearData(1.812, 0, 14), new  GearData(1.859, 2.739, 15), new  GearData(1.903, 2.804, 16)]);

    var z7_5= new GearDataRow(7.5, [new  GearData(1.313, 1.934, 6),new  GearData(1.396, 2.058, 7), new  GearData(1.471, 2.169, 8), new  GearData(1.540, 2.269, 9), new  GearData(1.603, 2.363, 10), new  GearData(1.717, 2.530, 12), new  GearData(1.818, 0, 14), new  GearData(1.864, 2.748, 15), new  GearData(1.909, 2.813, 16)]);
    var z8= new GearDataRow(8, [new  GearData(1.315, 1.938, 6),new  GearData(1.399, 2.062, 7), new  GearData(1.475, 2.173, 8), new  GearData(1.543, 2.274, 9), new  GearData(1.607, 2.368, 10), new  GearData(1.721, 2.536, 12), new  GearData(1.822, 0, 14), new  GearData(1.869, 2.755, 15), new  GearData(1.914, 2.820, 16)]);
    var z8_5= new GearDataRow(8.5, [new  GearData(1.318, 1.942, 6),new  GearData(1.402, 2.066, 7), new  GearData(1.478, 2.177, 8), new  GearData(1.547, 2.279, 9), new  GearData(1.610, 2.373, 10), new  GearData(1.725, 2.542, 12), new  GearData(1.827, 0, 14), new  GearData(1.874, 2.761, 15), new  GearData(1.919, 2.827, 16)]);

    var z9= new GearDataRow(9, [new  GearData(1.320, 1.944, 6),new  GearData(1.404, 2.069, 7), new  GearData(1.480, 2.181, 8), new  GearData(1.549, 2.283, 9), new  GearData(1.613, 2.377, 10), new  GearData(1.728, 2.547, 12), new  GearData(1.830, 0, 14), new  GearData(1.878, 2.767, 15), new  GearData(1.923, 2.833, 16)]);
    var z9_5= new GearDataRow(9.5, [new  GearData(1.321, 1.947, 6),new  GearData(1.406, 2.072, 7), new  GearData(1.482, 2.184, 8), new  GearData(1.552, 2.287, 9), new  GearData(1.616, 2.381, 10), new  GearData(1.731, 2.552, 12), new  GearData(1.834, 0, 14), new  GearData(1.881, 2.773, 15), new  GearData(1.926, 2.839, 16)]);
    var z10= new GearDataRow(10, [new  GearData(1.323, 1.949, 6),new  GearData(1.408, 2.075, 7), new  GearData(1.484, 2.187, 8), new  GearData(1.554, 2.290, 9), new  GearData(1.618, 2.385, 10), new  GearData(1.734, 2.556, 12), new  GearData(1.837, 0, 14), new  GearData(1.884, 2.777, 15), new  GearData(1.929, 2.844, 16)]);

    var z11= new GearDataRow(11, [new  GearData(1.326, 1.954, 6),new  GearData(1.411, 2.080, 7), new  GearData(1.488, 2.193, 8), new  GearData(1.558, 2.296, 9), new  GearData(1.623, 2.391, 10), new  GearData(1.739, 2.563, 12), new  GearData(1.842, 0, 14), new  GearData(1.890, 2.785, 15), new  GearData(1.935, 2.852, 16)]);
    var z12= new GearDataRow(12, [new  GearData(1.328, 1.957, 6),new  GearData(1.414, 2.084, 7), new  GearData(1.491, 2.197, 8), new  GearData(1.561, 2.301, 9), new  GearData(1.626, 2.397, 10), new  GearData(1.743, 2.569, 12), new  GearData(1.847, 0, 14), new  GearData(1.895, 2.792, 15), new  GearData(1.940, 2.859, 16)]);

    var gearData = [z3, z4, z5, z6, z6_5, z7, z7_5, z8, z8_5, z9, z9_5, z10, z11, z12];

    var dataRow;
    var data;
    for (let row of gearData) {
        if(row.gearRatio == gearRatio) {
            dataRow = row.gearData;
            break;
        }
    }
    console.log(dataRow);
    if (dataRow) {
        for (let d of dataRow) {
            if(d.z == pinionNumber) {
                data = d;
                break;
            }
        }
    }
    console.log(data);
    if(data){
        drawGear(pinionNumber * gearRatio, gearModule, hf, data.ha, s, data.p);
    } else {
        // error
    }
}

function drawEpicyclicPinion(teethNumber, gearModule){
    var s;
    if (teethNumber > 10){
        s= 1.25;
    } else {
        s= 1.05;
    }

    var p;
    var ha;

    // profile A
    if (teethNumber>= 10) {
        if (s==1.05) {
            p= 0.525;
            ha= 0.525;
        } else if (s==1.25) {
            p= 0.625;
            ha= 0.625;
        }
    }   
    // profile B 
    else if (teethNumber >= 8 && teethNumber <= 9) {
        if (s==1.05) {
            p= 0.70;
            ha= 0.67;
        } else if (s==1.25) {
            p= 0.83;
            ha= 0.805;
        }
    }
    // profile C 
    else if (teethNumber >= 6 && teethNumber <= 7) {
        if (s==1.05) {
            p= 1.05;
            ha= 0.855;
        } else if (s==1.25) {
            p= 1.25;
            ha= 1.05;
        }
    } else {
        // error
    }

    var hf = ha+0.4;

    drawGear(teethNumber, gearModule, hf, ha, s, p);
}

function gearTypeSelection(){
    var gearType = document.getElementById("gear-type").value;

    if (gearType == "epicycloidal") {
        document.getElementById("form_going_train").style.visibility= "visible";
    } else {
        document.getElementById("form_going_train").style.visibility= "hidden";
    }
}

function pinionOrWheelSelected(){
    var gearType = document.getElementById("pinion-or-wheel").value;
    console.log(gearType);
    if (gearType == "wheel") {
        document.getElementById("form_going_train_wheel").style.visibility= "visible";
    } else {
        document.getElementById("form_going_train_wheel").style.visibility= "hidden";
    }
}

function buttonClick() {
    var magnification = 100;
    var teethNumber = document.getElementById("teeth-number").value;
    var gearType = document.getElementById("gear-type").value;
    var gearModule = document.getElementById("gear-module").value*magnification;
    console.log(teethNumber);
    console.log(gearType);
    console.log(gearModule);

    //Create SVG element
    svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    //Create and append rectangle element
    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr('stroke', 'black')
        .attr('fill', '#69a3b2');


    if (gearType == "epicycloidal") {
        var pinionOrWheel= document.getElementById("pinion-or-wheel").value;
        console.log(pinionOrWheel);
        if (pinionOrWheel == "wheel") {
            //document.getElementById("error-message").innerHTML = "Sorry not currently supported";
            var pinionNumber = document.getElementById("pinion-teeth-number").value;
            var gearRatio = document.getElementById("gear-ratio").value;;
            drawEpicyclicWheel(pinionNumber, gearRatio, gearModule);
        } else {
            drawEpicyclicPinion(teethNumber, gearModule);
        }
        
    } else {
        drawCycloidalGear(teethNumber, gearModule);
    }
}  

function init() {
    gearTypeSelection();
}

//init();