export const fetchRepos = ({ language, stars, page }, cb) => {
  var apiUrl = "https://api.github.com/search/repositories";

  var url = `${apiUrl}?q=language:${language.toLowerCase()}+good-first-issues:>0+stars:0..${stars}&sort=stars&order=desc&page=${page}`;
  console.log(url);
  fetch(url)
    .then(data => data.json())
    .then(cb);
};

export const saveUserPreference = (stars, language) => {
  console.log(stars, language);
  localStorage.setItem("user-pref", JSON.stringify({ stars, language }));
};

export const getUserPreference = () =>
  JSON.parse(localStorage.getItem("user-pref"));
