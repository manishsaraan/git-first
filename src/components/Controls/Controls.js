import React, { useState } from "react";
import Select from "react-select";
import InputRange from "react-input-range";
import CheckboxInput from '../CheckboxInput/CheckboxInput';
import languages from "../../assets/lang.json";
import bookmark from '../../assets/bookmark.svg';
import bookmarked from '../../assets/bookmarked.svg';

const Controls = props => {
  const [selectedLanguage, updateSelectedLanguage] = useState({
    "label": "All Languages",
    "value": ""
  });
  const [stars, updateStars] = useState(50);
  const [searchText, updateSearchText] = useState("");
  const [isFirstIssue, updateIsFirstIssue] = useState(false);
  const [isBookmark, updateIsBookmark] = useState(true);

  const handleChange = selectedLanguage => {
    updateSelectedLanguage(selectedLanguage);
  };

  const handleSearch = event => {
    updateSearchText(event.target.value);
  }

  const checkIsFirstIssue = isFirstIssue => {
    updateIsFirstIssue(isFirstIssue.target.checked);
  }

  const showBookmarks = () => {
    if (isBookmark) {
      props.exploreProjects(isBookmark, {});
    } else {
      props.exploreProjects(false, { stars, searchText, selectedLanguage, isFirstIssue })
    }

    updateIsBookmark(!isBookmark);

  };

  const handleSubmit = () => props.exploreProjects(false, { stars, searchText, selectedLanguage, isFirstIssue });

  return (
    <div className="selector-container">
      <div className="row">
        <div className="col-8 offset-md-1 controls-container">
          <input className="search-box" type="text" neme="search" value={searchText} placeholder="Search..."
            onChange={handleSearch}
          />
          <div className="row">
            <div className="col-7">
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
            <div className="col-2">
              <CheckboxInput isFirstIssue={isFirstIssue} checkIsFirstIssue={checkIsFirstIssue} />
            </div>
          </div>
        </div>

        <div className="col-1">
          <button
            className="btn btn-secondary btn-lg explore-button"
            type="button"
            id="search"
            onClick={handleSubmit}
            disabled={!isBookmark}
          >
            Explore
          </button>
        </div>
        <div className="col-1">
          <button className="btn btn-secondary btn-lg view-bookmarked-repos" onClick={showBookmarks}>
            <img src={isBookmark ? bookmark : bookmarked} alt="show bookmarked" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
