export const fetchRepos = ({ language, stars, searchText, selectedLabel }, cb) => {
  const apiUrl = "https://api.github.com/search/repositories";

  let searchUrl = `${apiUrl}?q=${searchText.replace(/ /g, "+")}+in:readme`;

  if (language) {
    searchUrl += `+language:${language.toLowerCase()}`;
  }

  if (selectedLabel) {
    searchUrl += `+${selectedLabel.value}:>0`;
  }

  searchUrl += `+stars:0..${stars}&sort=stars&order=desc&per_page=100`;

  fetch(searchUrl)
    .then(data => data.json())
    .then(cb);
};

export const saveUserPreference = (stars, language, selectedLabel) => {
  localStorage.setItem("user-pref", JSON.stringify({ stars, language, selectedLabel }));
};

export const getUserPreference = () =>
  JSON.parse(localStorage.getItem("user-pref"));
