$(function() {
  var slider = $("#slider").XSlider({
    min: 10,
    max: 1000,
    className: "mobile",
    handleAutoSize: false,
    tooltipDirection: "bottom",
    tooltipFormat: function(val) {
      return 'Stars: <span style="color:red">' + val + "</span>";
    }
  });

  // get languages
  fetch("./lang.json")
    .then(data => data.json())
    .then(data => {
      var languageHTML = data.map(function(item) {
        return `<option value="${item.value}">${item.title}</option>`;
      });
      document.querySelector("#language").innerHTML = languageHTML;
      // In your Javascript (external .js resource or <script> tag)
      $(document).ready(function() {
        $("#language").select2();
      });
    });

  // search results
  $("#search").click(function() {
    var apiUrl = "https://api.github.com/search/repositories";
    var issue = $("input[name='issue_type']:checked").val();
    var stars = "0.." + slider.getValue();
    var language = $("#language")
      .val()
      .toLowerCase();

    var final_url = `${apiUrl}?q=language:${language}+good-first-issues:>0+stars:${stars}&sort=stars&order=desc`;
    console.log(final_url);
    findRepos(final_url);
  });
  function findRepos(url) {
    fetch(url)
      .then(data => data.json())
      .then(data => {
        console.log(data);
        var total_records = data.total_count;
        var recordsPerPage = 30;
        var total_pages = Math.ceil(total_records / recordsPerPage);
        var repoHTML = "";
        var repos = data.items.forEach(function(item) {
          repoHTML += `<div class="col-3 item-container">
            <div class="repo-container ">
            <div class="profile-container">
              <div class="profile-image">
               <img src="https://avatars3.githubusercontent.com/u/5618407?v=4" />
              </div>
              <a href="${item.owner.url}">
               <div class="user-information">
                <h2>${item.owner.login}</h2>
                <p>Visit Profile</p>
               </div>
              </a>
            </div>
           <div class="repo-name">
             <a href="${item.html_url}">${item.name}</a>
           </div>
           <div class="created-info row text-muted small">
            <div class="col-3">Build by</div>
            <div  class="col-3">  <a>${item.owner.login}</a></div>
            <span class="col-4">2 JUne 2036</span>
           </div>
           <div class="repo-description">
           ${item.description}
           </div>
           <div class="repo-info">
            <span class="language">${item.language}</span>
            <span class="stars">
            <svg viewBox="0 0 14 16" version="1.1" width="14" height="16" role="img"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg> ${
              item.stargazers_count
            }</span>
            <span  class="issues">
            <a href='https://github.com/instrumenta/conftest/issues?q=is:issue+is:open+label:"good+first+issue"'>
            <svg class="octicon octicon-issue-opened" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>${
              item.open_issues_count
            }
            </a>
            </span>
           </div>
           </div></div>`;
        });
        console.log(repoHTML);

        document.querySelector("#output").innerHTML = repoHTML;
      });
  }
});
