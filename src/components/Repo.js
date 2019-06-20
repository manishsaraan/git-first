import React from "react";
import dateFns from "date-fns";
var FontAwesome = require("react-fontawesome");

const Repo = ({ repo }) => {
  return (
    <div className="col-3 item-container">
      <div className="repo-container ">
        <div className="profile-container">
          <div className="profile-image">
            <img alt={repo.owner.login} src={repo.owner.avatar_url} />
          </div>

          <div className="user-information">
            <div className="row no-gutters">
              <div className="col-8">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={repo.owner.html_url}
                >
                  <div>
                    <h2>{repo.owner.login}</h2>
                  </div>
                  <p>Visit Profile</p>
                </a>
              </div>
              <div className="col-4">
                <span className="float-right">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href='https://github.com/instrumenta/conftest/issues?q=is:issue+is:open+label:"good+first+issue"'
                  >
                    <FontAwesome name="external-link" />
                  </a>
                </span>
                <span className="float-right bookmark">
                  <FontAwesome name="bookmark" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="repo-name">
          <a target="_blank" rel="noopener noreferrer" href={repo.html_url}>
            {repo.name}
          </a>
        </div>
        <div className="created-info no-gutters row text-muted small">
          <div className="col-3">Build by</div>
          <div className="col-4">{repo.owner.login}</div>
          <span className="col-4">
            {dateFns.format(repo.created_at, "D MMM, YYYY")}
          </span>
        </div>
        <div className="repo-description">{repo.description}</div>
        <div className="repo-info">
          <span className="language">{repo.language}</span>
          <span className="stars">
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
            </svg>{" "}
            {repo.stargazers_count}
          </span>
          <span className="issues">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href='https://github.com/instrumenta/conftest/issues?q=is:issue+is:open+label:"good+first+issue"'
            >
              <svg
                className="issue-count"
                viewBox="0 0 14 16"
                version="1.1"
                width="14"
                height="16"
                aria-hidden="true"
              >
                <path
                  fillRule={"evenodd"}
                  d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"
                />
              </svg>
              {repo.open_issues_count}
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Repo;
