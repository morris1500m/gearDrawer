import React from "react";
import { GearForm } from './GearForm';
import { GearSvg } from './GearSvg';

function App() {
  const [module, setModule] = React.useState(0.2);
  const [gearDimensions, setGearDimensions] = React.useState(null);

  const onFormChange = (change) =>{
    setModule(change.module);
    setGearDimensions(change.gear);
  }
  return (
    <div className="App">
      <GearForm onFormChange={onFormChange} initModule={module} />
      <GearSvg gearDimensions={gearDimensions} module={module} />
    </div>
  );
}

export default App;
