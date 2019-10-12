import React, { Component } from "react";
import { fetchRepos, saveUserPreference } from "./lib";
import Repo from "./components/Repo";
import Loader from "./components/Loader/Loader";
import Controls from "./components/Controls/Controls";
import "./App.css";

class App extends Component {
  state = {
    repos: [],
    showLoader: false,
    totalPages: 0,
    showBookmars: false,
    bookmarkedRepos: [],
    isFirstIssue: false
  };

  exploreProjects = (showBookmars, { stars, searchText, selectedLanguage, isFirstIssue }) => {
    this.setState({ showLoader: true });

    // show locally saved repos
    if (showBookmars) {
      let { bookmarkedRepos } = this.state;

      if (bookmarkedRepos.length === 0) {
        bookmarkedRepos = JSON.parse(localStorage.getItem("savedRepos")) || [];
      }

      this.setState({ showBookmars: true, bookmarkedRepos, showLoader: false, isFirstIssue });

      return;
    } else {

      fetchRepos(
        { language: selectedLanguage.value, stars, searchText, isFirstIssue },
        response => {
          console.log(response);
          const { total_count, items } = response;
          const totalPages = Math.ceil(total_count / 30);

          this.setState({
            showLoader: false,
            repos: items,
            totalPages,
            showBookmars: false,
            isFirstIssue
          });

          saveUserPreference(stars, selectedLanguage.value);
        }
      );
    }
  };

  handleBookmark = (repo) => {
    let bookmarkedRepos = JSON.parse(localStorage.getItem("savedRepos")) || [];
    const findRepoIndex = bookmarkedRepos.findIndex(bRepo => bRepo.id === repo.id);
    console.log(findRepoIndex);
    if (findRepoIndex > -1) {
      bookmarkedRepos.splice(findRepoIndex, 1);
    } else {
      bookmarkedRepos = [...bookmarkedRepos, repo];
    }

    localStorage.setItem("savedRepos", JSON.stringify(bookmarkedRepos));

    this.setState({ bookmarkedRepos });

  };

  isBookmarkedRepo = (repo) => {
    const { showBookmars } = this.state;
    if (showBookmars) {
      return true;
    }

    let { bookmarkedRepos } = this.state;
    const findRepoIndex = bookmarkedRepos.findIndex(bRepo => bRepo.id === repo.id);

    return findRepoIndex > -1 ? true : false;
  }

  render() {
    const { repos, showLoader, bookmarkedRepos, showBookmars,isFirstIssue } = this.state;
    const showRepos = showBookmars ? bookmarkedRepos : repos;

    const reposHtml =
      showRepos.length === 0 ? (
        <div className="no-repos col-12">No Repositories</div>
      ) : (
          showRepos.map(repo => <Repo repo={repo} isFirstIssue={isFirstIssue} isBookmarkedRepo={this.isBookmarkedRepo(repo)} handleBookmark={this.handleBookmark} key={repo.id} />)
        );

    return (
      <div className="container-fluid">
        <div className="text-center jumbotron">
          <p className="hero-text">
            Search beginner friendly projects on Github
          </p>
          <p>
            {" "}
            Repositories can be fetched based on <b>language</b>,{" "}
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
