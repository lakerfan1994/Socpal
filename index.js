const todayMatchApi = "https://worldcup.sfg.io/matches";
const flagUrl = 'https://restcountries.eu/rest/v2/name/';
const youtubeEmbedder = "https://www.youtube.com/embed/";
const youtubeEndpoint = "https://www.googleapis.com/youtube/v3/search";
const keyCode = "AIzaSyDh3vRFgUTk0R12FpgTN-_K11udH4RmHjk";
const teamListApi = 'https://worldcup.sfg.io/teams/';

function listOfWorldCupTeams(){
  $('.prev-game-button').click(function(){
     $('header').addClass('hidden');
    $('.game-chooser').empty();
    $('.leading-content').append(`<div class="centered-text"><ul class="list-of-teams"></ul></div>`);
    getTeamListApi(listTeams);


  })
}


function listTeams(data){
  const listOfTeams = data.sort(groupSort).map(item => renderTeamList(item));
  $('.list-of-teams').prepend(listOfTeams);
  $('main').removeClass('hidden');
  $('.current-game').removeClass('hidden');
}

function groupSort(country1, country2) {
  return country1.id - country2.id;
}

function renderTeamList(data){
  return `<li><a href='https://en.wikipedia.org/wiki/${data.country}'><p>${data.country}</p></a></li>`;
}

function showCurrentGames(){
  $('.current-game-button').click(function(){
    $('header').addClass("hidden");
    $('main').removeClass('hidden');
    $('.game-chooser').addClass('hidden');
    $('.current-game').removeClass('hidden');
    getSoccerApi(showCurrentMatch);
  })
}

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



function returnFromGames() {
  $('.back-button').click(function(){
    $('.current-game').addClass('hidden');
    $('main').addClass('hidden');
    emptyApp();
    $('header').removeClass('hidden');
  })
}

function searchCountryMatches() {
  $('#js-form').submit(function(event){
    event.preventDefault();
    $('main').removeClass('hidden');
    $('.game-chooser').empty();
    $('.game-chooser').removeClass('hidden');
    getSoccerApi(filterForSearch);
  })
}

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

function chooseSelectedMatch(data) {
  $('header').addClass("hidden");
  $('.game-chooser').addClass('hidden');
  $('.current-game').removeClass('hidden');
  const userAnswer = $('.selectedAnswer').text();
  let cleanedString = userAnswer.replace(/vs|0|1|2|3|4|5|6|7|8|9|-/gi, "");
  let arrayOfTeams = cleanedString.trim().split(" ");
  console.log(arrayOfTeams);
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
  console.log(arrayOfTeams);
  const selectedMatch = data.find(item => item.home_team_country === arrayOfTeams[0] && item.away_team_country === arrayOfTeams[2]);
  const homeFlagId = selectedMatch.home_team_country;
  const awayFlagId = selectedMatch.away_team_country;
  const searchMatch = `${homeFlagId} vs ${awayFlagId} fifa world cup 2018`;
  getYoutubeApi(searchMatch, updateVideos);
  renderAllStats(selectedMatch);
  getFlagApi(homeFlagId, awayFlagId, renderHomeFlag, renderAwayFlag );


}


function getSoccerApi(callback) {
  const params = {url: todayMatchApi, data: {by_date: "desc"}, success: callback }
  $.ajax(params);
}

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
  console.log(`${flagUrl}${homeFlag}`)
  $.ajax(params);
  const params2 = {url: `${flagUrl}${awayFlag}`, success: awayCallBack};
  console.log(`${flagUrl}${awayFlag}`);
  $.ajax(params2);
}

function getYoutubeApi(searchTerm, callback) {
  const params = {url: youtubeEndpoint, data: {part: "snippet", q: searchTerm, key: keyCode}, success: callback};
  $.ajax(params);
}

function getTeamListApi(callback) {
  const params = {url: teamListApi, data: {by_date: "desc"}, success: callback }
  $.ajax(params);
}


function findMostRecentGame(game) {
 return game.status !== "future"
}

function renderHomeStats(item) {
  let homeTeamEvents = item.home_team_events;
  homeTeamEvents = homeTeamEvents.filter(isEventGoal);
  homeTeamEvents = homeTeamEvents.map(renderPlayerGoal);

  return `<div class="centered-text">
            <h3>Goals scored by:</h3>
            ${homeTeamEvents}
          </div> `
}

function isEventGoal(item) {
  return (item.type_of_event === 'goal' || item.type_of_event === 'goal-penalty' || item.type_of_event === 'goal-own');
}

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

function renderAwayStats(item) {
  let awayTeamEvents = item.away_team_events;
  awayTeamEvents = awayTeamEvents.filter(isEventGoal);
  awayTeamEvents = awayTeamEvents.map(renderPlayerGoal);

  return `<div class="centered-text">
            <h3>Goals scored by:</h3>
            ${awayTeamEvents}
          </div> `
}

function renderMatchInfo(item) {
  
  if(item.home_team.penalties !== 0 && item.away_team.penalties !== 0) {
  return `<div class="centered-text">
            <h2>${item.home_team_country}  vs  ${item.away_team_country}</h2>
            <h3>${item.home_team.goals}(${item.home_team.penalties}) : ${item.away_team.goals}(${item.away_team.penalties})</h3>
          </div>  `}
  else
  {
    return `<div class="centered-text">
      <h2>${item.home_team_country}  vs  ${item.away_team_country}</h2>
      <h3>${item.home_team.goals} : ${item.away_team.goals}</h3>
    </div> `
    
  }
}

function renderAllStats(item) {
  $('.left-main').append(renderHomeStats(item));
  $('.right-main').append(renderAwayStats(item));
  $('.leading-content').append(renderMatchInfo(item));
}


function getFlagPicture(data) {
  return `<img src=${data[0].flag}>`
}

function renderHomeFlag(homeFlag) {
  $('.flag-1').append(getFlagPicture(homeFlag));
}

function renderAwayFlag(awayFlag) {
  $('.flag-2').append(getFlagPicture(awayFlag));
}



function renderYoutubeVideos(data) {
  return `
  <div class="row">
      <iframe src=${youtubeEmbedder}${data.items[0].id.videoId} alt="soccer video"></iframe>
  </div> `
}

function updateVideos(data) {
  $('.leading-content').append(renderYoutubeVideos(data));
}

function emptyApp() {
  $('.flag-1').empty();
  $('.left-main').empty();
  $('.leading-content').empty();
  $('.flag-2').empty();
  $('.right-main').empty();
}

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

function renderSearchMatches(item) {
  return `<div class="answerOption">
           <input type="radio" role="radio" name="answerOption" required>
           <p>${item.home_team_country} vs ${item.away_team_country} ${item.home_team.goals} - ${item.away_team.goals}</p>
          </div> `
}


$(showCurrentGames);
$(returnFromGames);
$(searchCountryMatches);
$(selectSearchedTeam);
$(listOfWorldCupTeams);