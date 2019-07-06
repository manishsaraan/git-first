import React, { Component } from "react";
import { fetchRepos, saveUserPreference, getUserPreference } from "./lib";
import Repo from "./components/Repo";
import Loader from "./components/Loader/Loader";
import Controls from "./components/Controls/Controls";
import "./App.css";

class App extends Component {
  state = {
    repos: [],
    showLoader: false,
    page: 1,
    totalPages: 0,
    showBookmars: false,
  };

  trackScrolling = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      console.log("scroll to bottom");

      const { stars, language } = getUserPreference();
      const { repos, page } = this.state;
      fetchRepos({ language, stars, page }, fetchedRepos => {
        console.log(repos);
        this.setState({ repos: [...repos, ...fetchedRepos.items] });
      });
    }
  };

  exploreProjects = (showBookmars, stars, selectedLanguage) => {
    console.log(selectedLanguage);

    this.setState({ showLoader: true });

    if(showBookmars){
      const bookmarkedRepos = JSON.parse(localStorage.getItem("savedRepos")) || [];
      this.setState({repos: bookmarkedRepos, showBookmars: true, showLoader: false });
      return;
    }

    const { page } = this.state;

    fetchRepos(
      { language: selectedLanguage.value, stars, page: 1 },
      response => {
        console.log(response);
        const { total_count, items } = response;
        const totalPages = Math.ceil(total_count / 30);

        this.setState({
          showLoader: false,
          repos: items,
          totalPages,
          showBookmars: false,
          page: page + 1
        });

        saveUserPreference(stars, selectedLanguage.value);
       // document.addEventListener("scroll", this.trackScrolling);
      }
    );
  };

  handleBookmark = (repo) => {
    let bookmarkedRepos = JSON.parse(localStorage.getItem("savedRepos")) || [];
    const findRepoIndex = bookmarkedRepos.findIndex( bRepo => bRepo.id === repo.id);
    console.log(findRepoIndex);
    if (findRepoIndex > -1) {
      bookmarkedRepos.splice(findRepoIndex, 1);
    }else{
      bookmarkedRepos = [ ...bookmarkedRepos, repo ];
    }

    localStorage.setItem("savedRepos", JSON.stringify(bookmarkedRepos));

    if(this.state.showBookmars){
      this.setState({repos: bookmarkedRepos })
    }
  };

  render() {
    const { repos, showLoader, bookmarkedRepos } = this.state;
    console.log(bookmarkedRepos);
    const reposHtml =
      repos.length === 0 ? (
        <div className="no-repos col-12">No Repositories</div>
      ) : (
        repos.map(repo => <Repo repo={repo} handleBookmark={this.handleBookmark} key={repo.id} />)
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
