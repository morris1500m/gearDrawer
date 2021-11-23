
import styled from 'styled-components';
import makerjs from 'makerjs'
import React from 'react';
import parse from 'html-react-parser'
import DrawGear from './classes/GearDrawing/DrawGear';

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

export const TestMakerJs = ({gearDimensions, module}) => {

    var getGear = () => {
        if(gearDimensions){
            var test = DrawGear.drawGear(module, gearDimensions);
            return test;
        } else {
            return null;
        }
    }

    const gear = getGear();
    const mag =1;

    var finalModel = { models: {}, paths: {} };

    gear?.lines?.forEach((line, index) => {
        const makerLine = {
            type: 'line', 
            origin: [line.startPoint.x*mag, line.startPoint.y*mag], 
            end: [line.endPoint.x*mag, line.endPoint.y*mag] };
        finalModel.paths[index] = makerLine; 
    });

    gear?.arcs?.forEach((arc, index) => {
        var startAngle = arc.startAngle * (180/Math.PI);
        var endAngle = arc.endAngle * (180/Math.PI);
        const makerArc = {
            type: 'arc', 
            origin: [arc.centrePoint.x*mag, arc.centrePoint.y*mag],
            radius: arc.radius*mag,
            startAngle: startAngle,
            endAngle: endAngle
        }
        finalModel.paths[index+gear.lines.length] = makerArc; 
    });
      
    var svg = makerjs.exporter.toSVG(finalModel);

    return (
    <Wrapper>
        {parse(svg)}
    </Wrapper>
    );
};