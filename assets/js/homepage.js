var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

var getUserRepos = function(user) {
  // format the igthub api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a request to the  url
    fetch(apiUrl).then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          displayRepos(data,user);
        });
      } else {
        alert("Error: GitHub User Not Found");
      }
    })
    .catch(function(error) {
      // Notice this `.catch()` getting chained to the end of the `.then()`
      alert("Unable to connect to GitHub");
    });
};

var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");

var formSubmitHandler = function(event) {
  event.preventDefault();
  // get value from input element
  var username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("Please enter a GitHub username");
  }
  console.log(event);
};

var displayRepos = function(repos, searchTerm) {
  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositiories found.";
    return;
  }
  console.log(repos);
  console.log(searchTerm);
  // clear old content
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  // llop over repos
  for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a container for each repo 
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    // create a span element to hold repo name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // append to container
    repoEl.appendChild(titleEl);

    // create status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count;
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>" + repos[i].open_issues_count;
    }

    // append to container 
    repoEl.appendChild(statusEl);


    // append container to the DOM
    repoContainerEl.appendChild(repoEl);
  }
};

var getFeaturedRepos = function(language) {
  var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        displayRepos(data.items, language);
      });
    } else {
      alert('Error: GitHub user Not Found');
    }
  });
};

userFormEl.addEventListener("submit", formSubmitHandler);

var buttonClickHandler = function(event) {
  var language = event.target.getAttribute("data-language");
  console.log(language);

  if (language) {
    getFeaturedRepos(language);
    
    // clear old content
    repoContainerEl.textContent = "";
  }
};

languageButtonsEl.addEventListener("click", buttonClickHandler);