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
 
export const DownloadForm = () => {

    return (
    <>  
        <StyledForm>
            <h1>Download Options</h1>
            {/*<Button download={GetFileName()} href={`data:application/octet-stream;base64,${btoa(dxfString)}`} variant="contained">Download DXF</Button>*/}
            <Button variant="contained">Download DXF</Button>
        </StyledForm>
    </>
    );
};