
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

    var svg;
    if(gear){
        svg = makerjs.exporter.toSVG(gear);
    } else {
        svg = "<p>Loading...</p>"
    }

    return (
    <Wrapper>
        {parse(svg)}
    </Wrapper>
    );
};