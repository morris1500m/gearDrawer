import React, { useState, useEffect } from "react";
import {Dropdown} from "./form-components/Dropdown"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import GetGearDimensions from "./classes/GearPropeties/GetGearDimensions";
import styled from 'styled-components';

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
    width: 30%;
    padding: 12px 20px;
    margin: 8px 0;
    float: left;
`;
 
export const GearForm = ({onFormChange, onDownloadButtonClick, initModule}) => {
    // Select Objects
    const gearTypes = [{text:"Epicycloidal (going train)", value:"epicycloidal"}, {text:"Cycloidal (winding, hand setting etc.)", value:"cycloidal"}];
    const selectPinionOrWheel = [{text:"Wheel", value:"wheel"}, {text:"Pinion", value:"pinion"}];

    const ConvertToSelect = (x) => { return {text:x, value:x};} 
    const availbleEpicyclicGearRatios = GetGearDimensions.GetEpicyclicGearRatios().map(x => ConvertToSelect(x));
    const availbleEpicyclicPinionNumbers = GetGearDimensions.GetEpicyclicPinionNumbers().map(x =>ConvertToSelect(x));

    // State
    const [gearType, setGearType] = React.useState(gearTypes[0].value);
    const [pinionOrWheel, setPinionOrWheel] = React.useState(selectPinionOrWheel[0].value);
    const [module, setModule] = React.useState(initModule);
    const [teethNumber, setTeethNumber] = React.useState(8);
    const [pinionNumber, setPinionNumber] = React.useState(availbleEpicyclicPinionNumbers[0].value);
    const [gearRatio, setGearRatio] = React.useState(availbleEpicyclicGearRatios[0].value);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [gearDimensions, setGearDimensions] = React.useState(null);

    useEffect(() => {
        var newGearDimensions;
        try {
            if (gearType === gearTypes[0].value && pinionOrWheel === selectPinionOrWheel[0].value){
                newGearDimensions = GetGearDimensions.GetEpicyclicWheelDimensions(pinionNumber, gearRatio);
            } else if (gearType === gearTypes[0].value && pinionOrWheel === selectPinionOrWheel[1].value) {
                newGearDimensions = GetGearDimensions.GetEpicyclicPinionDimensions(pinionNumber);
            } else if (gearType === gearTypes[1].value) {
                newGearDimensions = GetGearDimensions.GetCycloidalGearDimensions(teethNumber);
            }
        } catch (err) {
            setErrorMessage(err.message);
        }

        if(newGearDimensions) {
            setErrorMessage("");
            setGearDimensions(newGearDimensions);
            onFormChange({"gear":newGearDimensions, "module":module});
        };
    }, [gearType, pinionOrWheel, module, teethNumber, pinionNumber, gearRatio]);

    const EpicyclicPinionForm = () =>{
        return (
            <>
                <Dropdown onChange ={(e) => setPinionOrWheel(e)} currentSelection={pinionOrWheel} id="pinion-or-wheel" label="" options={selectPinionOrWheel} />
                <Dropdown onChange ={(e) => setPinionNumber(e)} currentSelection={pinionNumber} id="pinion-number" label="Select Pinion Number:" options={availbleEpicyclicPinionNumbers} />
            </>
        )
    }

    const EpicyclicWheelForm = () =>{
        return (
            <>
                <Dropdown onChange ={(e) => setPinionOrWheel(e)} currentSelection={pinionOrWheel} id="pinion-or-wheel" label="" options={selectPinionOrWheel} />
                <Dropdown onChange ={(e) => setPinionNumber(e)} currentSelection={pinionNumber} id="pinion-number" label="Select Pinion Number:" options={availbleEpicyclicPinionNumbers} />
                <Dropdown onChange ={(e) => setGearRatio(e)} currentSelection={gearRatio} id="gear-ratio" label="Gear Ratio:" options={availbleEpicyclicGearRatios} />
            </>
        )
    }

    const CycloidalWheelForm = () =>{
        return (
            <>
                <StyledTextField id="wheel-teeth-number" label="wheel-teeth-number" onChange={(e) => setTeethNumber(e.target.value)} />
            </>
        )
    }

    const GetForm = () =>{
        if (gearType === gearTypes[0].value && pinionOrWheel === selectPinionOrWheel[0].value){
            return EpicyclicWheelForm();
        } else if (gearType === gearTypes[0].value && pinionOrWheel === selectPinionOrWheel[1].value) {
            return EpicyclicPinionForm();
        } else if (gearType === gearTypes[1].value) {
            return CycloidalWheelForm();
        }
    }

    const GetFileName = () =>{
        const mod = module.toString().replaceAll(".", "_");

        if (gearType === gearTypes[0].value && pinionOrWheel === selectPinionOrWheel[0].value){
            // EpicyclicWheel
            return gearType + "_wheel_gearModule" + mod + "teethNum" + (pinionNumber*gearRatio);
        } else if (gearType === gearTypes[0].value && pinionOrWheel === selectPinionOrWheel[1].value) {
            // EpicyclicPinion
            return gearType + "_pinion_gearModule" + mod + "teethNum" + pinionNumber;
        } else if (gearType === gearTypes[1].value) {
            // CycloidalWheel
            var pinionOrWheelString= teethNumber>=16 ? "wheel" : "pinion";
            return gearType + "_" + pinionOrWheelString + "_gearModule" + mod + "teethNum" + teethNumber; 
        }
    }

    return (
    <>  
        <StyledForm>
            <h1>Gear Drawer</h1>
            <StyledTextField  id="module" label="module" onChange={(e) => setModule(e.target.value)} />
			<Dropdown onChange ={(e) => setGearType(e)} id="gear-type" label="Choose a gear type:" currentSelection={gearType} options={gearTypes} />
            {GetForm()}
            <Button variant="contained" onClick={() => {onDownloadButtonClick(GetFileName())}}>Download Gear SVG</Button>
            <p>{errorMessage}</p>
        </StyledForm>
        {/*
        <p>Gear type: {gearType}</p>
        <p>Module: {module}</p>
        <p>Pinion or Wheel?: {pinionOrWheel}</p>
        <p>Teeth number: {teethNumber}</p>
        <p>Pinion number: {pinionNumber}</p>
        <p>Gear Ratio: {gearRatio}</p>
        <p>{JSON.stringify(gearDimensions)}</p>
        <p>{errorMessage}</p>
        */}
    </>
    );
};