import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styled from 'styled-components';
import { SpokeForm } from './SpokeForm';
import DrawGear from './classes/GearDrawing/DrawGear';
import makerjs from 'makerjs';
import parse from 'html-react-parser';
import { GearForm } from './GearForm';
import { DownloadForm } from './DownloadForm';

const Wrapper = styled.div`
  width: 60%;
  padding: 8px 8px;
  margin: 8px 0;
  display: inline-block;
  float: right;
  `;

const StyledSvg = styled.svg`
  width: 60%;
  `;  

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  const StyledDiv = styled.div`
    width: 30%;
    padding: 12px 20px;
    margin: 8px 0;
    float: left;
    `;

  return (
    <StyledDiv
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </StyledDiv>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [svg, setSvg] = React.useState("<p>Loading</p>");
  const [dxf, setDxf] = React.useState(null);

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {setValue(newValue);};

  const onFormChange = (change) =>{
    var newGear = DrawGear.drawGear(change.module, change.gear);
    console.log(newGear);
    var newSvg = makerjs.exporter.toSVG(newGear);
    setSvg(newSvg);

    var newDxf = makerjs.exporter.toDXF(newGear);
    setDxf(newDxf);
  }

  var module = 5;

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Gear" {...a11yProps(0)} />
          <Tab label="Spokes" {...a11yProps(1)} />
          <Tab label="Export" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
          <GearForm onFormChange={onFormChange} initModule={module} dxfString={dxf} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SpokeForm />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DownloadForm />
      </TabPanel>
      <Wrapper>{parse(svg)}</Wrapper>
    </>
  );
}
