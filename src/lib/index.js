const fetchRepos = ({ language, stars }, cb) => {
  var apiUrl = "https://api.github.com/search/repositories";

  var url = `${apiUrl}?q=language:${language.toLowerCase()}+good-first-issues:>0+stars:${stars}&sort=stars&order=desc`;
  console.log(url);
  fetch(url)
    .then(data => data.json())
    .then(cb);
};

export default fetchRepos;
