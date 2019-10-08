export const fetchRepos = ({ language, stars, searchText, isFirstIssue }, cb) => {
  const apiUrl = "https://api.github.com/search/repositories";

  let searchUrl = `${apiUrl}?q=${searchText}`;
  console.log(language)
  if (language) {
    searchUrl += `+language:${language.toLowerCase()}`;
  }

  if (isFirstIssue) {
    searchUrl += `+good-first-issues:>0`;
  }

  searchUrl += `+stars:0..${stars}&sort=stars&order=desc&per_page=100`;

  console.log(searchUrl);
  fetch(searchUrl)
    .then(data => data.json())
    .then(cb);
};

export const saveUserPreference = (stars, language) => {
  console.log(stars, language);
  localStorage.setItem("user-pref", JSON.stringify({ stars, language }));
};

export const getUserPreference = () =>
  JSON.parse(localStorage.getItem("user-pref"));
