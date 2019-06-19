import React, { Component } from "react";
import { fetchRepos, saveUserPreference, getUserPreference } from "./lib";
import Repo from "./components/Repo";
import Loader from "./components/Loader/Loader";
import Controls from "./components/Controls/Controls";
import "./App.css";
console.log(saveUserPreference);
class App extends Component {
  state = {
    repos: [],
    showLoader: false
  };

  trackScrolling = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      console.log("scroll to bottom");

      const { stars, language } = getUserPreference();
      const { repos } = this.state;
      fetchRepos({ language, stars }, fetchedRepos => {
        console.log(repos);
        this.setState({ repos: [...repos, ...repos.items] });
      });
    }
  };

  exploreProjects = (stars, selectedLanguage) => {
    console.log(selectedLanguage);

    this.setState({ showLoader: true });
    fetchRepos({ language: selectedLanguage.value, stars }, repos => {
      console.log(repos);

      this.setState({ showLoader: false, repos: repos.items });

      saveUserPreference(stars, selectedLanguage.value);
      document.addEventListener("scroll", this.trackScrolling);
    });
  };

  render() {
    const { repos, showLoader } = this.state;
    const reposHtml =
      repos.length === 0 ? (
        <div className="no-repos col-12">No Repositories</div>
      ) : (
        repos.map(repo => <Repo repo={repo} key={repo.id} />)
      );

    return (
      <div className="container-fluid">
        <div className="text-center jumbotron">
          <p className="hero-text">
            Search beginner friendly projects on Github
          </p>
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
        <Controls exploreProjects={this.exploreProjects} />
        <div id="output" className="row">
          {showLoader ? <Loader /> : reposHtml}
        </div>
      </div>
    );
  }
}

export default App;
