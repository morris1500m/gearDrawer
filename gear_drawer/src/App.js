import React from "react";
import { GearForm } from './GearForm';
import { GearSvg } from './GearSvg';
import DownloadSvg from "./classes/Download/downloadSvg";

function App() {
  const [module, setModule] = React.useState(0.2);
  const [gearDimensions, setGearDimensions] = React.useState(null);
  
  const svgRef = React.useRef();
  function DownloadButtonClick(fileName, outerHtml) {
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, outerHtml], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);

    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  const onFormChange = (change) =>{
    setModule(change.module);
    setGearDimensions(change.gear);
  }

  const onDownloadButtonClick = (fileName) =>{
    //alert(fileName +" "+ svgRef.current.outerHTML);
    DownloadButtonClick(fileName, svgRef.current.outerHTML);
  }

  return (
    <div className="App">
      <GearForm onFormChange={onFormChange} onDownloadButtonClick={onDownloadButtonClick} initModule={module} />
      <GearSvg gearDimensions={gearDimensions} module={module} svgRef={svgRef} />
    </div>
  );
}

export default App;
