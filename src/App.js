import React, { useState } from "react";
import Select from "react-select";
import languages from "./assets/lang.json";
import "./App.css";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" }
];

function App() {
  const [selectedOption, updateSelectedOption] = useState(null);

  const handleChange = selectedOption => {
    updateSelectedOption(selectedOption);
    console.log(`Option selected:`, selectedOption);
  };

  return (
    <div className="container-fluid">
      <div className="hero-text jumbotron">
        Search beginner friendly projects on Github
      </div>
      <div className="selector-container">
        <div className="row">
          <div className="col-6">
            <span>max stars:</span>
            <div id="slider" />
          </div>
          <div className="col-3">
            <span>language:</span>
            <Select
              value={selectedOption}
              onChange={handleChange}
              options={languages}
            />
          </div>
          <div className="col-3">
            <button type="button" id="search">
              search
            </button>
          </div>
        </div>
      </div>
      <div id="output" className="row" />
    </div>
  );
}

export default App;
