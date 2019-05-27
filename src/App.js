import React, { useState } from "react";
import fetchRepos from "./lib";
import Repo from "./components/Repo";
import Loader from "./components/Loader/Loader";
import Controls from "./components/Controls/Controls";
import "./App.css";

const App = () => {
  const [repos, updateRepos] = useState([]);
  const [showLoader, updateShowLoader] = useState(false);

  const exploreProjects = (stars, selectedLanguage) => {
    console.log(selectedLanguage);
    updateShowLoader(true);

    fetchRepos({ language: selectedLanguage.value, stars }, repos => {
      console.log(repos);
      updateRepos(repos.items);
      updateShowLoader(false);
    });
  };

  const reposHtml =
    repos.length === 0 ? (
      <div className="no-repos col-12">No Repositories</div>
    ) : (
      repos.map(repo => <Repo repo={repo} key={repo.id} />)
    );
  console.log(reposHtml);
  return (
    <div className="container-fluid">
      <div className="hero-text jumbotron">
        Search beginner friendly projects on Github
      </div>
      <Controls exploreProjects={exploreProjects} />
      <div id="output" className="row">
        {showLoader ? <Loader /> : reposHtml}
      </div>
    </div>
  );
};

export default App;
