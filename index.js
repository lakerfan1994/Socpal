const todayMatchApi = "https://worldcup.sfg.io/matches";
const flagUrl = 'https://restcountries.eu/rest/v2/name/';
const youtubeEmbedder = "https://www.youtube.com/embed/";
const youtubeEndpoint = "https://www.googleapis.com/youtube/v3/search";
const keyCode = "AIzaSyDh3vRFgUTk0R12FpgTN-_K11udH4RmHjk";

function showCurrentGames(){
  $('.current-game-button').click(function(){
    $('header').addClass("hidden");
    $('.current-game').removeClass('hidden');
    getSoccerApi(updateInfo);
  })
}

function returnFromGames() {
  $('.back-button').click(function(){
    $('.current-game').addClass('hidden');
    emptyApp();
    $('header').removeClass('hidden');
  })
}

function searchCountryMatches() {
  $('#js-form').submit(function(event){
    event.preventDefault();
    getSoccerApi(filterForSearch);
  })
}

function selectSearchedTeam() {
  $('.game-chooser').on('click', 'button', function(event) {
    event.preventDefault();
    console.log("im printing OVER HERE");
    

  })
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

function updateInfo(data){
  let dataApi = data;
 const currentMatch = data.find(findMostRecentGame);
 const homeFlagId = currentMatch.home_team_country;
 const awayFlagId = currentMatch.away_team_country;
 const searchMatch = `${homeFlagId} vs ${awayFlagId} fifa world cup 2018`;
 getYoutubeApi(searchMatch, updateVideos);
 renderAllStats(currentMatch);
 getFlagApi(homeFlagId, awayFlagId, renderHomeFlag, renderAwayFlag );
}

function findMostRecentGame(game) {
 return game.status !== "future"
}

function renderHomeStats(item) {
  return `<div class="centered-text">
            <p>Goals scored: ${item.home_team.goals}</p>
          </div> `
}

function renderAwayStats(item) {
  return `<div class="centered-text">
            <p>Goals scored: ${item.away_team.goals}</p>
          </div> `
}

function renderMatchInfo(item) {
  return `<div class="centered-text">
            <h2>${item.home_team_country}  vs  ${item.away_team_country}</h2>
          </div>  `
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
    <div class="col-6">
      <iframe src=${youtubeEmbedder}${data.items[0].id.videoId} alt="soccer video"></iframe>
      <iframe src=${youtubeEmbedder}${data.items[1].id.videoId} alt="soccer video"></iframe>
      <iframe src=${youtubeEmbedder}${data.items[2].id.videoId} alt="soccer video"></iframe>
    </div>
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
  $('#textfield').val('');
  $('.game-chooser').empty();
  $('.game-chooser').append(`
        <h2 class="centered-text">Which game would you like to view?</h2>
        <form class= "chooser-form centered-text col-6" aria-live="assertive">
          <button type="submit" class="centered-text">Submit</button>
        </form> `);
  const arrayOfMatches = data.filter(item => item.home_team_country === userInput || item.away_team_country === userInput);
  const renderedMatches = arrayOfMatches.map(renderSearchMatches);
  $('.chooser-form').prepend(renderedMatches);
  
}

function renderSearchMatches(item) {
  return `<div class="answerOption">
           <input type="radio" role="radio" required>
           <span>${item.home_team_country} vs ${item.away_team_country} ${item.home_team.goals} - ${item.away_team.goals}</span>
          </div> `
}



$(showCurrentGames);
$(returnFromGames);
$(searchCountryMatches);
$(selectSearchedTeam);