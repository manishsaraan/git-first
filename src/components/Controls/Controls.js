import React, { useState } from "react";
import Select from "react-select";
import InputRange from "react-input-range";
import languages from "../../assets/lang.json";

const Controls = props => {
  const [selectedLanguage, updateSelectedLanguage] = useState({ value: "" });
  const [stars, updateStars] = useState(50);

  const handleChange = selectedLanguage => {
    updateSelectedLanguage(selectedLanguage);
  };

  const handleSubmit = () => props.exploreProjects(stars, selectedLanguage);

  return (
    <div className="selector-container">
      <div className="row">
        <div className="col-6 offset-md-1">
          <span>max stars:</span>
          <InputRange
            maxValue={1000}
            minValue={10}
            value={stars}
            onChange={value => updateStars(value)}
          />
        </div>
        <div className="col-3">
          <span>language:</span>
          <Select
            value={selectedLanguage}
            onChange={handleChange}
            options={languages}
          />
        </div>
        <div className="col-1">
          <button
            className="btn btn-secondary btn-lg explore-button"
            type="button"
            id="search"
            onClick={handleSubmit}
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
