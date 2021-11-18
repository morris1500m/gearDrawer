import Arc from "./Arc";
import Line from "./Line"

export default class Gear {
    arcs: Arc[];
    lines: Line[]; 
    outSideDiameter: number;
    
    constructor(arcs: Arc[], lines: Line[], outSideDiameter: number){
        this.arcs = arcs;
        this.lines = lines;
        this.outSideDiameter = outSideDiameter;
    }
}