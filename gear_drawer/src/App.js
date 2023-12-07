import React from "react";
import { GearForm } from './GearForm';
import styled from 'styled-components';
import makerjs from 'makerjs'
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

function App() {
  const [gear, setGear] = React.useState(null);
  const [svg, setSvg] = React.useState("<p>Loading</p>");
  const [dxf, setDxf] = React.useState(null);
  const module = 19;

  const onFormChange = (change) =>{
    console.log(change);
    console.log(change.toothRoot);
    var newGear = new DrawGear(change.module, change.gear, change.toothRoot);
    setGear(newGear.draw());
    var newSvg = makerjs.exporter.toSVG(newGear.draw());
    setSvg(newSvg);
    var newDxf = makerjs.exporter.toDXF(newGear.draw());
    setDxf(newDxf);
  }

  return (
    <div className="App">
      <GearForm onFormChange={onFormChange} initModule={module} dxfString={dxf} />
      <Wrapper>{parse(svg)}</Wrapper>
    </div>
  );
}

export default App;
