const todayMatchApi = "https://worldcup.sfg.io/matches";
const flagUrl = 'https://restcountries.eu/rest/v2/alpha/';

function showCurrentGames(){
  $('.current-game-button').click(function(){
    console.log("print");
    $('header').addClass("hidden");
    $('.current-game').removeClass('hidden');
    getSoccerApi(updateInfo);
  })
}


function getSoccerApi(callback) {
  const params = {url: todayMatchApi, data: {by_date: "desc"}, success: callback }
  $.ajax(params);
}

function updateInfo(data){
  let dataApi = data;
 const currentMatch = data.find(findMostRecentGame);
 const homeFlagId = currentMatch.home_team.code;
 const awayFlagId = currentMatch.away_team.code;
 getFlagApi(homeFlagId, )
 renderAllStats(currentMatch);
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
  $('.main-content').append(renderMatchInfo(item));
}

function getFlagApi(searchTerm, callback){
  const params = {url: `${flagUrl} + ${searchTerm}` , data: {}, success: callback}
}

function getHomeFlagPicture(data) {
  return 
}



$(showCurrentGames)