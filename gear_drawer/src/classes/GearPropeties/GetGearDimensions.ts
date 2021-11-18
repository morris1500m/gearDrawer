import { GearDimensions } from './GearDimensions';
import { GearData } from './GearData';
import { GearDataRow } from './GearDataRow'

 export default class GetGearDimensions {
    
    static GetCycloidalGearDimensions(teethNumber: number) {
        var s= 1.41;
        var hf= 1.75;
        var ha;
        var p;
    
        if (teethNumber<8) {
            throw new RangeError("minimum number of pinion teeth for Cycloidal gear is 8");
        } else if (teethNumber===8) {
            ha = 1.16;
            p = 1.85;
        } else if (teethNumber===9) {
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

        return new GearDimensions(teethNumber, hf, ha, s, p);
    }

    static GetEpicyclicGearRatios(){
        var gearData = this.GetEpicyclicGearData();
        var gearRatios: Array<number> = [];

        for (let row of gearData) {
            gearRatios.push(row.gearRatio);
        }
        return gearRatios;
    }

    static GetEpicyclicPinionNumbers(){
        var gearData = this.GetEpicyclicGearData();
        var row: GearDataRow = gearData[0];
        var gearPinionNumbers: Array<number> = [];

        for (let data of row.gearData){
            gearPinionNumbers.push(data.z);
        }
        return gearPinionNumbers;
    }

    static GetEpicyclicGearData(){
        var z3= new GearDataRow(3, [new  GearData(1.259, 1.855, 6),new  GearData(1.335, 1.968, 7), new  GearData(1.403, 2.068, 8), new  GearData(1.465, 2.160, 9), new  GearData(1.523, 2.244, 10), new  GearData(1.626, 2.396, 12), new  GearData(1.718, 2.532, 14), new  GearData(1.760, 2.594, 15), new  GearData(1.801, 2.654, 16)]);
        var z4= new GearDataRow(4, [new  GearData(1.280, 1.886, 6),new  GearData(1.359, 2.003, 7), new  GearData(1.430, 2.107, 8), new  GearData(1.494, 2.202, 9), new  GearData(1.554, 2.290, 10), new  GearData(1.661, 2.448, 12), new  GearData(1.756, 2.589, 14), new  GearData(1.801, 2.654, 15), new  GearData(1.843, 2.715, 16)]);
        var z5= new GearDataRow(5, [new  GearData(1.293, 1.906, 6),new  GearData(1.374, 2.025, 7), new  GearData(1.447, 2.132, 8), new  GearData(1.513, 2.230, 9), new  GearData(1.574, 2.320, 10), new  GearData(1.684, 2.482, 12), new  GearData(1.782, 2.626, 14), new  GearData(1.827, 2.692, 15), new  GearData(1.870, 2.756, 16)]);

        var z6= new GearDataRow(6, [new  GearData(1.303, 1.920, 6),new  GearData(1.385, 2.041, 7), new  GearData(1.459, 2.150, 8), new  GearData(1.526, 2.249, 9), new  GearData(1.588, 2.341, 10), new  GearData(1.700, 2.505, 12), new  GearData(1.799, 2.652, 14), new  GearData(1.845, 2.719, 15), new  GearData(1.889, 2.784, 16)]);
        var z6_5= new GearDataRow(6.5, [new  GearData(1.307, 1.926, 6),new  GearData(1.389, 2.048, 7), new  GearData(1.464, 2.157, 8), new  GearData(1.531, 2.257, 9), new  GearData(1.594, 2.349, 10), new  GearData(1.707, 2.516, 12), new  GearData(1.807, 2.662, 14), new  GearData(1.853, 2.730, 15), new  GearData(1.897, 2.795, 16)]);
        var z7= new GearDataRow(7, [new  GearData(1.310, 1.930, 6),new  GearData(1.393, 2.053, 7), new  GearData(1.468, 2.163, 8), new  GearData(1.536, 2.263, 9), new  GearData(1.599, 2.356, 10), new  GearData(1.712, 2.523, 12), new  GearData(1.812, 2.671, 14), new  GearData(1.859, 2.739, 15), new  GearData(1.903, 2.804, 16)]);

        var z7_5= new GearDataRow(7.5, [new  GearData(1.313, 1.934, 6),new  GearData(1.396, 2.058, 7), new  GearData(1.471, 2.169, 8), new  GearData(1.540, 2.269, 9), new  GearData(1.603, 2.363, 10), new  GearData(1.717, 2.530, 12), new  GearData(1.818, 2.679, 14), new  GearData(1.864, 2.748, 15), new  GearData(1.909, 2.813, 16)]);
        var z8= new GearDataRow(8, [new  GearData(1.315, 1.938, 6),new  GearData(1.399, 2.062, 7), new  GearData(1.475, 2.173, 8), new  GearData(1.543, 2.274, 9), new  GearData(1.607, 2.368, 10), new  GearData(1.721, 2.536, 12), new  GearData(1.822, 2.686, 14), new  GearData(1.869, 2.755, 15), new  GearData(1.914, 2.820, 16)]);
        var z8_5= new GearDataRow(8.5, [new  GearData(1.318, 1.942, 6),new  GearData(1.402, 2.066, 7), new  GearData(1.478, 2.177, 8), new  GearData(1.547, 2.279, 9), new  GearData(1.610, 2.373, 10), new  GearData(1.725, 2.542, 12), new  GearData(1.827, 2.692, 14), new  GearData(1.874, 2.761, 15), new  GearData(1.919, 2.827, 16)]);

        var z9= new GearDataRow(9, [new  GearData(1.320, 1.944, 6),new  GearData(1.404, 2.069, 7), new  GearData(1.480, 2.181, 8), new  GearData(1.549, 2.283, 9), new  GearData(1.613, 2.377, 10), new  GearData(1.728, 2.547, 12), new  GearData(1.830, 2.697, 14), new  GearData(1.878, 2.767, 15), new  GearData(1.923, 2.833, 16)]);
        var z9_5= new GearDataRow(9.5, [new  GearData(1.321, 1.947, 6),new  GearData(1.406, 2.072, 7), new  GearData(1.482, 2.184, 8), new  GearData(1.552, 2.287, 9), new  GearData(1.616, 2.381, 10), new  GearData(1.731, 2.552, 12), new  GearData(1.834, 2.703, 14), new  GearData(1.881, 2.773, 15), new  GearData(1.926, 2.839, 16)]);
        var z10= new GearDataRow(10, [new  GearData(1.323, 1.949, 6),new  GearData(1.408, 2.075, 7), new  GearData(1.484, 2.187, 8), new  GearData(1.554, 2.290, 9), new  GearData(1.618, 2.385, 10), new  GearData(1.734, 2.556, 12), new  GearData(1.837, 2.707, 14), new  GearData(1.884, 2.777, 15), new  GearData(1.929, 2.844, 16)]);

        var z11= new GearDataRow(11, [new  GearData(1.326, 1.954, 6),new  GearData(1.411, 2.080, 7), new  GearData(1.488, 2.193, 8), new  GearData(1.558, 2.296, 9), new  GearData(1.623, 2.391, 10), new  GearData(1.739, 2.563, 12), new  GearData(1.842, 2.715, 14), new  GearData(1.890, 2.785, 15), new  GearData(1.935, 2.852, 16)]);
        var z12= new GearDataRow(12, [new  GearData(1.328, 1.957, 6),new  GearData(1.414, 2.084, 7), new  GearData(1.491, 2.197, 8), new  GearData(1.561, 2.301, 9), new  GearData(1.626, 2.397, 10), new  GearData(1.743, 2.569, 12), new  GearData(1.847, 2.722, 14), new  GearData(1.895, 2.792, 15), new  GearData(1.940, 2.859, 16)]);

        return [z3, z4, z5, z6, z6_5, z7, z7_5, z8, z8_5, z9, z9_5, z10, z11, z12];
    }

    static GetEpicyclicWheelDimensions(pinionNumber: number, gearRatio: number) {
        var s= 1.57;
        var hf= 1.57;
        var gearData = this.GetEpicyclicGearData();

        var dataRow;
        var data;

        for (let row of gearData) {
            if(row.gearRatio === gearRatio) {
                dataRow = row.gearData;
                break;
            }
        }

        if (dataRow) {
            for (let d of dataRow) {
                if(d.z === pinionNumber) {
                    data = d;
                    break;
                }
            }
        }
        
        if(data){
            return new GearDimensions(pinionNumber * gearRatio, hf, data.ha, s, data.p);
        } else {
            // error
        }
    }

    static GetEpicyclicPinionDimensions(teethNumber: number){
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
            if (s===1.05) {
                p= 0.525;
                ha= 0.525;
            } else if (s===1.25) {
                p= 0.625;
                ha= 0.625;
            }
        }   
        // profile B 
        else if (teethNumber >= 8 && teethNumber <= 9) {
            if (s===1.05) {
                p= 0.70;
                ha= 0.67;
            } else if (s===1.25) {
                p= 0.83;
                ha= 0.805;
            }
        }
        // profile C 
        else if (teethNumber >= 6 && teethNumber <= 7) {
            if (s===1.05) {
                p= 1.05;
                ha= 0.855;
            } else if (s===1.25) {
                p= 1.25;
                ha= 1.05;
            }
        } else {
            throw new RangeError("Minimum number of teeth in Epicyclic wheel is 6");
        }

        if(ha && p){
            var hf = ha+0.4;
            return new GearDimensions(teethNumber, hf, ha, s, p);
        }
    }
}