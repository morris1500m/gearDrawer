import DrawGear from "./classes/GearDrawing/DrawGear";
import * as d3Shape from 'd3-shape';
import styled from 'styled-components';

const Wrapper = styled.div`
    width: 60%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    float: right;
`;

const StyledSvg = styled.svg`
    width: 60%;
`;

export const GearSvg = ({gearDimensions, module, svgRef}) => {

    var getGear = () => {
        if(gearDimensions){
            var test = DrawGear.drawGear(module, gearDimensions);
            return test;
        } else {
            return null;
        }
    }

    function createArcTest(arc) {
        return d3Shape
            .arc()
            .innerRadius(arc.radius)
            .outerRadius(arc.radius)
            .startAngle(arc.startAngle)
            .endAngle(arc.endAngle)();
    }    

    const gear = getGear();
    const viewBoxSize = gear?.outSideDiameter? gear.outSideDiameter: 100;
    const strokeWidth = viewBoxSize/400;

    return (
    <Wrapper>
        <h1>SVG</h1>
        <StyledSvg viewBox={"0 0 "+viewBoxSize+" "+viewBoxSize} ref={svgRef} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            {/*<rect width={viewBoxSize} height={viewBoxSize} fill='#8a89a6' stroke="black" stroke-width={strokeWidth} />*/}
            {gear?.lines.map(line => (
                <>
                    <line x1={line.startPoint.x} y1={line.startPoint.y} x2={line.endPoint.x} y2={line.endPoint.y} stroke="black" stroke-width={strokeWidth} stroke-linecap="round" />
                </>
            ))}
            {gear?.arcs.map(arc => (
                <>
                    <path d={createArcTest(arc)} transform={"translate("+arc.centrePoint.x+" "+arc.centrePoint.y+")"} fill='#8a89a6' stroke="black" stroke-width={strokeWidth} stroke-linecap="round" />
                </>
            ))}
        </StyledSvg>
    </Wrapper>
    );
};