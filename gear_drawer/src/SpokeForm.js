import React, { useState, useEffect } from "react";
import {Dropdown} from "./form-components/Dropdown"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import GetGearDimensions from "./classes/GearPropeties/GetGearDimensions";
import styled from 'styled-components';
import { Checkbox } from "@mui/material";
import { FormControlLabel } from "@mui/material";

const StyledTextField = styled(TextField)`
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
`;

const StyledForm = styled.form`
    width: 80%;
    padding: 12px 20px;
    margin: 8px 0;
    float: left;
`;
 
export const SpokeForm = () => {
    const [spokeNum, setSpokeNum] = React.useState(0);
    const [centreHoleDia, setCentreHoleDia] = React.useState(0);

    const [internalBoss, setInternalBoss] = React.useState(0);
    const [outerBoss, setOuterBoss] = React.useState(0);
    const [taperAngle, setTaperAngle] = React.useState(0);

    const [centreHole, setCentreHole] = React.useState(true);
    const [spokes, setSpokes] = React.useState(true);
    const [roundBottom, setRoundBottom] = React.useState(false);
    const [taper, setTaper] = React.useState(true);

    return (
    <>  
        <StyledForm>
            <h1>Spoke Options</h1>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Centre Hole" onChange={(e) => setCentreHole(e.target.checked)} />
            <StyledTextField  id="centreHoleDia" label="Centre Hole Diameter" onChange={(e) => setCentreHoleDia(e.target.value)} />

            <FormControlLabel control={<Checkbox defaultChecked />} label="Spokes" onChange={(e)=> setSpokes(e.target.checked)} />
            <StyledTextField  id="spokeNum" label="Spoke Number" onChange={(e) => setSpokeNum(e.target.value)} />
            <StyledTextField  id="internalBoss" label="Internal Boss" onChange={(e) => setInternalBoss(e.target.value)} />
            <StyledTextField  id="outerBoss" label="Outer Boss" onChange={(e) => setOuterBoss(e.target.value)} />

            <FormControlLabel control={<Checkbox defaultChecked />} label="Round Bottom" onChange={(e)=> setRoundBottom(e.target.checked)} />

            <FormControlLabel control={<Checkbox defaultChecked />} label="Taper" onChange={(e)=> setTaper(e.target.checked)} />
            <StyledTextField  id="taperAngle" label="Taper Angle" onChange={(e) => setTaperAngle(e.target.value)} />

        </StyledForm>
    </>
    );
};