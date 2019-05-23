import React, { useState } from "react";
import Select from "react-select";
import InputRange from "react-input-range";
import languages from "./assets/lang.json";
import fetchRepos from "./lib";
import Repo from "./components/Repo";
import "./App.css";

const App = () => {
  const [selectedLanguage, updateSelectedLanguage] = useState(null);
  const [stars, updateStars] = useState(50);
  const [repos, updateRepos] = useState([]);

  const handleChange = selectedLanguage => {
    updateSelectedLanguage(selectedLanguage);
  };

  const exploreProjects = () => {
    console.log(stars, selectedLanguage);
    fetchRepos({ language: selectedLanguage.value, stars }, repos => {
      console.log(repos);
      updateRepos(repos.items);
    });
  };

  return (
    <div className="container-fluid">
      <div className="hero-text jumbotron">
        Search beginner friendly projects on Github
      </div>
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
              onClick={exploreProjects}
            >
              Explore
            </button>
          </div>
        </div>
      </div>
      <div id="output" className="row">
        {repos.map(repo => (
          <Repo repo={repo} key={repo.id} />
        ))}
      </div>
    </div>
  );
};

export default App;
