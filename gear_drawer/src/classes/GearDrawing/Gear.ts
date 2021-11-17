import Arc from "./Arc";
import Line from "./Line"

export default class Gear {
    arcs: Arc[];
    lines: Line[]; 
    
    constructor(arcs: Arc[], lines: Line[]){
        this.arcs = arcs;
        this.lines = lines;
    }
}