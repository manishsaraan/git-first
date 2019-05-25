import React, { useState } from "react";
import fetchRepos from "./lib";
import Repo from "./components/Repo";
import Loader from "./components/Loader/Loader";
import Controls from "./components/Controls/Controls";
import "./App.css";

const App = () => {
  const [repos, updateRepos] = useState([]);

  const exploreProjects = (stars, selectedLanguage) => {
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
      <Controls exploreProjects={exploreProjects} />
      <div id="output" className="row">
        <Loader />
        {repos.map(repo => (
          <Repo repo={repo} key={repo.id} />
        ))}
      </div>
    </div>
  );
};

export default App;
