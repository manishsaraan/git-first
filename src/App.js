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

  return (
    <div className="container-fluid">
      <div className="text-center jumbotron">
        <p className="hero-text">Search beginner friendly projects on Github</p>
        <p>
          {" "}
          Repositories will be fetched based on{" "}
          <span className="issue-badge badge badge-secondary">
            good first issue
          </span>{" "}
          and no of{" "}
          <svg
            viewBox="0 0 14 16"
            version="1.1"
            width="14"
            height="16"
            role="img"
          >
            <path
              fillRule={"evenodd"}
              d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"
            />
          </svg>
          .
        </p>
      </div>
      <Controls exploreProjects={exploreProjects} />
      <div id="output" className="row">
        {showLoader ? <Loader /> : reposHtml}
      </div>
    </div>
  );
};

export default App;
