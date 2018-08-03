const todayMatchApi = "https://worldcup.sfg.io/matches";
const flagUrl = 'https://restcountries.eu/rest/v2/name/';
const youtubeEmbedder = "https://www.youtube.com/embed/";
const youtubeEndpoint = "https://www.googleapis.com/youtube/v3/search";
const keyCode = "AIzaSyDh3vRFgUTk0R12FpgTN-_K11udH4RmHjk";
const teamListApi = 'https://worldcup.sfg.io/teams/';

//This function on click of the List of Teams button in the application clears everything out, adds an unordered list to the main app,
//then runs the getTeamListApi call
function listOfWorldCupTeams() { 
  $('.list-button').click(function(){
    emptyApp();
    getTeamListApi(listTeams);
    $('.main-list').removeClass('hidden');
    $('.scroll-to-top').removeClass('hidden');
    document.querySelector('.scroll-to-top').scrollIntoView({ behavior: 'smooth' });
  })
}

//This function is basically an ajax call to the endpoint defined at teamListApi that then runs the function listTeams on success as defined
//by listOfWorldCupTeams
function getTeamListApi(callback) {
  const params = {url: teamListApi, data: {by_date: "desc"}, success: callback }
  $.ajax(params);
}

//This function sorts teams based on their group then renders the long list in the DOM
function listTeams(data){
  const listOfTeams = data.sort(groupSort).map(item => renderTeamList(item));
  $('.list-of-teams-container').append(listOfTeams);
}


//Sorts teams by group
function groupSort(country1, country2) {
  return country1.id - country2.id;
}
//Creates every list item of a team after it has been sorted. Each list item is an anchor that links to that countries wikipedia article.
function renderTeamList(data){
  return `<div class= 'new-list-item'><a class= 'centered-text'href='https://en.wikipedia.org/wiki/${data.country}'><p>${data.country}</p></a></div>`;
}

//On clicking recent game, this function then runs methods that send an ajax request to the API that handles match data, and runs
//a callback function that shows information of the most recent game
function showCurrentGames(){
  $('.current-game-button').click(function(){
    emptyApp();
    $('.current-game').removeClass('hidden');
    $('.scroll-to-top').removeClass('hidden');
    getSoccerApi(showCurrentMatch);
    document.querySelector('.leading-content').scrollIntoView({ behavior: 'smooth' });
  })
}

//This is an ajax call that gets match info for matches played in the tournament
function getSoccerApi(callback) {
  const params = {url: todayMatchApi, data: {by_date: "desc"}, success: callback }
  $.ajax(params);
}

//This function is the callback function used by getSoccerApi to structure and render the most current match data. It searches 
//through the match data received as a paramater and finds the most recent game, then makes calls to both the youtube api as well
//as the flag api to find the appropriate information to display the match. 
function showCurrentMatch(data){
 let dataApi = data;
 const currentMatch = data.find(findMostRecentGame);
 const homeFlagId = currentMatch.home_team_country;
 const awayFlagId = currentMatch.away_team_country;
 const searchMatch = `${homeFlagId} vs ${awayFlagId} fifa world cup 2018 highlights`;
 getYoutubeApi(searchMatch, updateVideos);
 renderAllStats(currentMatch);
 getFlagApi(homeFlagId, awayFlagId, renderHomeFlag, renderAwayFlag );
}

//function used to find the most recent game by finding the last played game
function findMostRecentGame(game) {
 return game.status !== "future"
}

//Basically an ajax to the Youtube API for information, takes a query string as the search term and a callback function upon success
function getYoutubeApi(searchTerm, callback) {
  const params = {url: youtubeEndpoint, data: {part: "snippet", q: searchTerm, key: keyCode}, success: callback};
  $.ajax(params);
}

// callback function used by showCurrentMatch that handles the rendering of the Youtube video for a match
function updateVideos(data) {
  $('.leading-content').append(renderYoutubeVideos(data));
}  

//This function handles the functions that place stats in the different sectors of the application
function renderAllStats(item) {
  $('.left-main').append(renderHomeStats(item));
  $('.right-main').append(renderAwayStats(item));
  $('.leading-content').append(renderMatchInfo(item));
}

//function that handles the home team statistics. It uses the isEventGoal and renderPlayerGoal method to generate
//statistics and place it in the DOM
function renderHomeStats(item) {
  let homeTeamEvents = item.home_team_events;
  homeTeamEvents = homeTeamEvents.filter(isEventGoal);
  homeTeamEvents = homeTeamEvents.map(renderPlayerGoal);

  return `<div class="centered-text">
            <h2>${item.home_team_country}</h2>
            <h3>Goals scored by:</h3>
            ${homeTeamEvents}
          </div> `
}

//function that handles the away team statistics in the exact same way as the renderAwayStats method above. 
function renderAwayStats(item) {
  let awayTeamEvents = item.away_team_events;
  awayTeamEvents = awayTeamEvents.filter(isEventGoal);
  awayTeamEvents = awayTeamEvents.map(renderPlayerGoal);

  return `<div class="centered-text">
            <h2>${item.away_team_country}</h2>
            <h3>Goals scored by:</h3>
            ${awayTeamEvents}
          </div> `
}

//This function is used by both renderHomeStats and renderAwayStats to sort through all events in the game to find only events
//that resulted in a goal
function isEventGoal(item) {
  return (item.type_of_event === 'goal' || item.type_of_event === 'goal-penalty' || item.type_of_event === 'goal-own');
}

//This function simply chooses between three different kinds of events and generates information about the match to put into the Dom based 
//on the information received.
function renderPlayerGoal(item) {
  if(item.type_of_event === 'goal'){
     return `<p>${item.player} at "${item.time}"</p>
          <img src='http://clipart-library.com/images/pT58x9r7c.png' class='soccer-ball' alt='image of a soccer ball'>`
  }
  if(item.type_of_event === 'goal-penalty'){
     return `<p>${item.player} at "${item.time}"</p>   
          <img src='https://banner2.kisspng.com/20180421/xae/kisspng-penalty-shootout-play-foot-ball-games-penalty-kick-penalty-clipart-5adad6c08a8592.7117409615242912645674.jpg' class='penalty-kick' alt='image of a penalty kick'>`
  }
  if(item.type_of_event === 'goal-own')
  {
     return  `<p>${item.player} at "${item.time}"</p>
          <img src='https://www.toonpool.com/user/6485/files/worst_soccer_player_ever_1071775.jpg' class='soccer-ball-bad' alt='image of a person kicking himself in the head'>`
  }
}


//This function essentially handles the methods used to search for a specific game by country. It waits for a button submit event
//and clears the Dom of some information
function searchCountryMatches() {
  $('#js-form').submit(function(event){
    event.preventDefault();
    emptyApp();
    $('.game-chooser').removeClass('hidden');
    $('.scroll-to-top').removeClass('hidden');
    getSoccerApi(filterForSearch);
    document.querySelector('.game-chooser').scrollIntoView({ behavior: 'smooth' });
    
  })
}

//This method on selection of the match to view, runs the functions required to generate and render the match, while also 
//accounting for the user not selecting a match to watch
function selectSearchedTeam() {
  $('.game-chooser').on('click', 'button', function(event) {
    const userAnswer = $('input:checked').val();
    if(userAnswer === undefined) {
     return;
    }
    else {
    event.preventDefault();
    $('input:checked').siblings().addClass('selectedAnswer');
    getSoccerApi(chooseSelectedMatch);
    }
  })
}
//callback function for the getSoccerApi function, this takes match data and cleans the user selection 
//into a string array containing both the home team string and away string team. It then finds a match 
//between the two teams and runs the methods used to generate a match
function chooseSelectedMatch(data) {
  const userAnswer = $('.selectedAnswer').text();
  emptyApp();
   $('.current-game').removeClass('hidden');
  let cleanedString = userAnswer.replace(/vs|0|1|2|3|4|5|6|7|8|9|-/gi, "");
  let arrayOfTeams = cleanedString.trim().split(" ");
  if(arrayOfTeams[0] === 'Korea') {
    arrayOfTeams[0] = 'Korea Republic';
    arrayOfTeams[2] = arrayOfTeams[3];
  }
  if(arrayOfTeams[2] === 'Korea') {
    arrayOfTeams[2] = 'Korea Republic';
  }
  if(arrayOfTeams[0] === 'Saudi') {
    arrayOfTeams[0] = 'Saudi Arabia';
    arrayOfTeams[2] = arrayOfTeams[3];
  }
   if(arrayOfTeams[2] === 'Saudi') {
    arrayOfTeams[2] = 'Saudi Arabia';
  }
  if(arrayOfTeams[0] === 'Costa') {
    arrayOfTeams[0] = 'Costa Rica';
    arrayOfTeams[2] = arrayOfTeams[3];
  }
  if(arrayOfTeams[2] === 'Costa') {
    arrayOfTeams[2] = 'Costa Rica';
  }
  const selectedMatch = data.find(item => item.home_team_country === arrayOfTeams[0] && item.away_team_country === arrayOfTeams[2]);
  const homeFlagId = selectedMatch.home_team_country;
  const awayFlagId = selectedMatch.away_team_country;
  const searchMatch = `${homeFlagId} vs ${awayFlagId} fifa world cup 2018`;
  getYoutubeApi(searchMatch, updateVideos);
  renderAllStats(selectedMatch);
  getFlagApi(homeFlagId, awayFlagId, renderHomeFlag, renderAwayFlag );
  $('.scroll-to-top').removeClass('hidden');


}


//This functions purpose is to generate a ajax call to the flag server to retrieve information on the flags of the two
//countries in the match
function getFlagApi(homeFlag, awayFlag, homeCallBack, awayCallBack){
  if(homeFlag === "England") {
    homeFlag = "United Kingdom";
  }

  if(awayFlag === "England") {
    awayFlag = "United Kingdom";
  }

  if(homeFlag === "Korea Republic") {
    homeFlag = "Korea";
  }

  if(awayFlag === "Korea Republic") {
    awayFlag = "Korea";
  }
  const params = {url: `${flagUrl}${homeFlag}`, success: homeCallBack};
  $.ajax(params);
  const params2 = {url: `${flagUrl}${awayFlag}`, success: awayCallBack};
  $.ajax(params2);
}




//This function simply renders the header portion of the match info page, and makes a different response if the teams were tied
function renderMatchInfo(item) {
  
  if(item.home_team.penalties !== 0 && item.away_team.penalties !== 0) {
  return `<div class="centered-text">
            <h2>${item.home_team_country}  vs  ${item.away_team_country}</h2>
            <h3>${item.home_team.goals}(${item.home_team.penalties})  : ${item.away_team.goals}(${item.away_team.penalties})</h3>
          </div>    `}
  else
  {
    return `<div class="centered-text">
      <h2>${item.home_team_country}  vs  ${item.away_team_country}</h2>
      <h3>${item.home_team.goals} : ${item.away_team.goals}</h3>
    </div>  `   
  }
}

//used by both renderHomeFlag and renderAway flag to render the actual picture of the flag
function getFlagPicture(data) {
  return `<img src=${data[0].flag} alt= 'picture of ${data[0].name}'s' flag'>`
}


//renders the home flag of the match
function renderHomeFlag(homeFlag) {
  $('.flag-1').append(getFlagPicture(homeFlag));
}

//renders the away flag of the match 
function renderAwayFlag(awayFlag) {
  $('.flag-2').append(getFlagPicture(awayFlag));
}


//renders the highlight video used in the main portion of the app
function renderYoutubeVideos(data) {
  return `
  <div class="row centered-text" label='Youtube soccer video'>
      <iframe src=${youtubeEmbedder}${data.items[0].id.videoId} title= 'Soccer video' aria-live= "assertive"></iframe>
  </div>
  <div class= 'guide row'>
    <div class= 'item centered-text'>
     <img class='soccer-ball' src= "http://clipart-library.com/images/pT58x9r7c.png" alt= 'Picture of a soccer ball'><p>Regular Goal</p>
    </div>
    <div class= 'item centered-text'>
      <img class= 'penalty-kick' src= "https://banner2.kisspng.com/20180421/xae/kisspng-penalty-shootout-play-foot-ball-games-penalty-kick-penalty-clipart-5adad6c08a8592.7117409615242912645674.jpg" alt= 'picture of a penalty kick'><p>Penalty Kick</p>
    </div>
    <div class= 'item centered-text'>
      <img class= 'soccer-ball-bad' src= "https://www.toonpool.com/user/6485/files/worst_soccer_player_ever_1071775.jpg" alt='picture of a guy kicking himself in the head'><p>Own Goal</p>
    </div>
  </div> `
}

//emptys the main portion of the app
function emptyApp() {
  $('.flag-1').empty();
  $('.left-main').empty();
  $('.leading-content').empty();
  $('.flag-2').empty();
  $('.right-main').empty();
  $('.list-of-teams-container').empty();
  $('.game-chooser').empty();
  $('.game-chooser').addClass('hidden');
  $('.main-list').addClass('hidden');
  $('.current-game').addClass('hidden');
  $('.scroll-to-top').addClass('hidden');
}

// a callback method for the soccerapi, it receives the api list of all match data and goes through a couple steps to 
//modify the userinput from the search bar to match information in the API, and finds all matches by the country entered 
//by the user
function filterForSearch(data) {
  let userInput = $('#textfield').val();
  userInput = userInput.toLowerCase();
  let tempString = userInput.slice(1);
  userInput = userInput.charAt(0).toUpperCase();
  userInput += tempString;
  if(userInput === 'Saudi arabia' || userInput === 'Korea republic' || userInput === 'Costa rica') {
    backString = userInput.slice(0,6);
    frontString = userInput.slice(7);
    userInput = userInput.charAt(6).toUpperCase();
    userInput = backString + userInput + frontString;
  };
  $('#textfield').val('');
  $('.game-chooser').append(`
        <h2 class="centered-text">Which game would you like to view?</h2>
        <form class= "chooser-form centered-text col-6 centered-element" aria-live="assertive">
          <button type="submit" class="centered-text">Submit</button>
        </form> `);
  const arrayOfMatches = data.filter(item => item.home_team_country === userInput || item.away_team_country === userInput);

  if(arrayOfMatches.length >= 1){
  const renderedMatches = arrayOfMatches.map(renderSearchMatches);
  $('.chooser-form').prepend(renderedMatches);
  }
  else{
    $('.game-chooser').empty();
    $('.game-chooser').append(`<h2 class="centered-text">Sorry, this entry was invalid. Please view the list of World Cup Teams tab above to see a list of valid entries.</h2>`);
  }
}

//renders the search results options for the user search
function renderSearchMatches(item) {
  return `<div class="answerOption">
           <input id= 'answer${item.fifa_id}' type="radio" role="radio" name="answerOption" required>
           <label class= 'choice-options' for= 'answer${item.fifa_id}'>${item.home_team_country} vs ${item.away_team_country} ${item.home_team.goals} - ${item.away_team.goals}</label>
          </div> `
}


//This function is responsible for running all of the callback functions that the entire utilizes
function runApp() {
  showCurrentGames();
  searchCountryMatches();
  selectSearchedTeam();
  listOfWorldCupTeams();
}

$(runApp);

