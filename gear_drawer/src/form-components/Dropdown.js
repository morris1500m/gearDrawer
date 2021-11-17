import React, { useState } from "react";
import {Select} from "@material-ui/core"
import styled from 'styled-components';

const StyledSelect = styled(Select)`
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
`;

export const Dropdown = ( {onChange, id, label, currentSelection, options} ) => {
    const [selectedOption, setSelectedOption] = useState(currentSelection);

    return (
        <>
            <label htmlFor={id}>{label}</label>
            <StyledSelect
            value={selectedOption}
            id={id}
            onChange={e => {
                setSelectedOption(e.target.value);
                onChange(e.target.value);
            }}>
            {options.map(o => (
                <option key={o.value} value={o.value}>{o.text}</option>
            ))}
            </StyledSelect>
        </>
    );
};