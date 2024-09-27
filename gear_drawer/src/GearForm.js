import React, { useState, useEffect } from "react";
import {Dropdown} from "./form-components/Dropdown"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import GetGearDimensions from "./classes/GearPropeties/GetGearDimensions";
import SpokeData from "./classes/GearDrawing/SpokeData";
import { SpokeType, getSpokeTypeFromString } from "./enums/SpokeType";
import styled from 'styled-components';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DataGridDemo from './TrainTable';

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

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }
 
export const GearForm = ({onFormChange, initModule, dxfString, gear}) => {
    // Select Objects
    const spokeTypes = Object.keys(SpokeType).map((key) => ({
        text: key,
        value: SpokeType[key],
      }));
    const gearTypes = [{text:"Epicycloidal (going train)", value:"epicycloidal"}, {text:"Cycloidal (winding, hand setting etc.)", value:"cycloidal"}];
    const selectPinionOrWheel = [{text:"Wheel", value:"wheel"}, {text:"Pinion", value:"pinion"}];

    const ConvertToSelect = (x) => { return {text:x, value:x};} 
    const availbleEpicyclicGearRatios = GetGearDimensions.GetEpicyclicGearRatios().map(x => ConvertToSelect(x));
    const availbleEpicyclicPinionNumbers = GetGearDimensions.GetEpicyclicPinionNumbers().map(x =>ConvertToSelect(x));
    const spokeNumbers = [3,4,5,6,8].map(x =>ConvertToSelect(x));

    console.dir(gear?.pitchRadius);
    console.dir(gear?.andendumRadius);

    // State
    const [gearType, setGearType] = React.useState(gearTypes[0].value);
    const [pinionOrWheel, setPinionOrWheel] = React.useState(selectPinionOrWheel[1].value);
    const [module, setModule] = React.useState(initModule);
    const [teethNumber, setTeethNumber] = React.useState(8);
    const [pinionNumber, setPinionNumber] = React.useState(availbleEpicyclicPinionNumbers[0].value);
    const [gearRatio, setGearRatio] = React.useState(availbleEpicyclicGearRatios[0].value);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [toothRoot, setToothRoot] = React.useState("round");
    const [drawSpokes, setDrawSpokes] = React.useState(false);
    const [spokes, setSpokes] = React.useState(new SpokeData(SpokeType.Rounded, 6, 0.25, 0.85, 0.10));

    const [value, setValue] = React.useState(0);

    useEffect(() => {
        var newGearDimensions;
        try {
            if (gearType === gearTypes[0].value && pinionOrWheel === selectPinionOrWheel[0].value){
                newGearDimensions = GetGearDimensions.GetEpicyclicWheelDimensions(pinionNumber, gearRatio);
            } else if (gearType === gearTypes[0].value && pinionOrWheel === selectPinionOrWheel[1].value) {
                newGearDimensions = GetGearDimensions.GetEpicyclicPinionDimensions(pinionNumber, gearRatio);
            } else if (gearType === gearTypes[1].value) {
                newGearDimensions = GetGearDimensions.GetCycloidalGearDimensions(teethNumber);
            }
        } catch (err) {
            setErrorMessage(err.message);
        }

        if(newGearDimensions) {
            setErrorMessage("");
            if (drawSpokes) {
                onFormChange({"gear":newGearDimensions, "module":module, "toothRoot": toothRoot, "spokes":spokes});
            }
            else {
                onFormChange({"gear":newGearDimensions, "module":module, "toothRoot": toothRoot, "spokes":new SpokeData(SpokeType.None, 0, 0, 0, 0)});
            }
        };
    }, [gearType, pinionOrWheel, module, teethNumber, pinionNumber, gearRatio, toothRoot, spokes, drawSpokes]);

    const WheelOrPinion = () => {
        return (
            <>
                <FormLabel id="wheel-pinion-group-label">Wheel or Pinion?</FormLabel>

                <RadioGroup
                aria-labelledby="wheel-pinion-group-label"
                value={pinionOrWheel}
                name="wheel-pinion-group"
                row
                onChange={(e) => setPinionOrWheel(e.currentTarget.value)}
            >
                {selectPinionOrWheel.map(function(object, i){
                    return <FormControlLabel value={object.value} control={<Radio />} label={object.text} />;
                })}
            </RadioGroup>
            </>
        )
    }

    const EpicyclicForm = () =>{
        return (
            <>
                <WheelOrPinion />
                <Dropdown onChange ={(e) => setPinionNumber(e)} currentSelection={pinionNumber} id="pinion-number" label="Select Pinion Number:" options={availbleEpicyclicPinionNumbers} />
                <Dropdown onChange ={(e) => setGearRatio(e)} currentSelection={gearRatio} id="gear-ratio" label="Gear Ratio:" options={availbleEpicyclicGearRatios} />
            </>
        )
    }

    const CycloidalWheelForm = () =>{
        return (
            <>
                <StyledTextField id="wheel-teeth-number" defaultValue={teethNumber}  label="wheel-teeth-number" onChange={(e) => setTeethNumber(e.target.value)} />
            </>
        )
    }

    const WheelSpokeForm = () =>{
        return (
            <>
                <Dropdown onChange ={(e) => {
                    const updatedObject = { ...spokes, spokeType: getSpokeTypeFromString(e) };
                    setSpokes(updatedObject);
                }} 
                id="spoke-type" label="Choose a spoke type:" currentSelection={spokes.spokeType.toString()} options={spokeTypes} />
                <Dropdown onChange ={(e) => {
                    const updatedObject = { ...spokes, spokeNumber: e };
                    setSpokes(updatedObject);
                }} 
                currentSelection={spokes.spokeNumber.toString()} id="spoke-number" label="Spoke Number:" options={spokeNumbers} />
                <StyledTextField id="inner-radius" defaultValue={spokes.innerRimRadius}  label="inner-radius" onChange={(e) => {
                    const updatedObject = { ...spokes, innerRimRadius: e.target.value };
                    setSpokes(updatedObject);
                }} />
                <StyledTextField id="outer-radius" defaultValue={spokes.outerRimRadius}  label="outer-radius" onChange={(e) => {
                    const updatedObject = { ...spokes, outerRimRadius: e.target.value };
                    setSpokes(updatedObject);
                }} />
                <StyledTextField id="spoke-thickness" defaultValue={spokes.spokeThickness}  label="spoke-thickness" onChange={(e) => {
                    const updatedObject = { ...spokes, spokeThickness: e.target.value };
                    setSpokes(updatedObject);
                }} />
                {spokes.spokeType == SpokeType.Tapered  && 
                (<StyledTextField id="spoke-angle" defaultValue={spokes.spokeAngle}  label="spoke-angle" onChange={(e) => {
                    const updatedObject = { ...spokes, spokeAngle: e.target.value };
                    setSpokes(updatedObject);
                }} />
                )}
            </>
        )
    }

    const GetForm = () =>{
        if (gearType === gearTypes[0].value && pinionOrWheel === selectPinionOrWheel[0].value){
            return EpicyclicForm();
        } else if (gearType === gearTypes[0].value && pinionOrWheel === selectPinionOrWheel[1].value) {
            return EpicyclicForm();
        } else if (gearType === gearTypes[1].value) {
            return CycloidalWheelForm();
        }
    }

    const GetFileName = () =>{
        const mod = module.toString().replaceAll(".", "_");

        if (gearType === gearTypes[0].value && pinionOrWheel === selectPinionOrWheel[0].value){
            // EpicyclicWheel
            return gearType + "_wheel_gearModule" + mod + "teethNum" + (pinionNumber*gearRatio) + ".dxf";
        } else if (gearType === gearTypes[0].value && pinionOrWheel === selectPinionOrWheel[1].value) {
            // EpicyclicPinion
            return gearType + "_pinion_gearModule" + mod + "teethNum" + pinionNumber + ".dxf";
        } else if (gearType === gearTypes[1].value) {
            // CycloidalWheel
            var pinionOrWheelString= teethNumber>=16 ? "wheel" : "pinion";
            return gearType + "_" + pinionOrWheelString + "_gearModule" + mod + "teethNum" + teethNumber + ".dxf"; 
        }
    }

    function a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
    <>  
    <StyledForm>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Item One" {...a11yProps(0)} />
                <Tab label="Gear" {...a11yProps(1)} />
                <Tab label="Spokes" {...a11yProps(2)} />
                <Tab label="Export" {...a11yProps(3)} />
            </Tabs>
        </Box>  
        <CustomTabPanel value={value} index={0}>
            <DataGridDemo />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
            <StyledTextField  id="module" label="module" defaultValue={module} onChange={(e) => setModule(e.target.value)} />

            <FormLabel id="teeth-root-group-label">Teeth Root</FormLabel>

            <RadioGroup
                aria-labelledby="teeth-root-group-label"
                value={toothRoot}
                name="teeth-root-group"
                row
                onChange={(e) => setToothRoot(e.currentTarget.value)}
            >
                <FormControlLabel value="square" control={<Radio />} label="Square" />
                <FormControlLabel value="round" control={<Radio />} label="Round" />
            </RadioGroup>

            <Dropdown onChange ={(e) => setGearType(e)} id="gear-type" label="Choose a gear type:" currentSelection={gearType} options={gearTypes} />
            {GetForm()}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
            <FormGroup>
                <FormControlLabel control={
                    <Checkbox checked={drawSpokes} 
                        onChange={(e) => setDrawSpokes(e.currentTarget.checked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                } label="Draw Spokes?" />
            </FormGroup>    
            
            {drawSpokes && (WheelSpokeForm())}
        </CustomTabPanel>  
        <CustomTabPanel value={value} index={3}>
            <Button download={GetFileName()} href={`data:application/octet-stream;base64,${btoa(dxfString)}`} variant="contained">Download DXF</Button>
        </CustomTabPanel>
        <p>{errorMessage}</p>
            <p>Pitch Diameter: {(gear?.pitchRadius * 2).toFixed(3)}mm</p>
            <p>Outside Diameter: {(gear?.andendumRadius * 2).toFixed(3)}mm</p>
        </StyledForm>
    </>
    );
};