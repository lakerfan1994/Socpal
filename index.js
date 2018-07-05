const todayMatchApi = "https://worldcup.sfg.io/matches";
const flagUrl = 'https://restcountries.eu/rest/v2/name/';

function showCurrentGames(){
  $('.current-game-button').click(function(){
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
 const homeFlagId = currentMatch.home_team_country;
 const awayFlagId = currentMatch.away_team_country;
 renderAllStats(currentMatch);
 getFlagApi(homeFlagId, awayFlagId, renderHomeFlag, renderAwayFlag )
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

function getFlagPicture(data) {
  return `<img src=${data[0].flag}>`
}

function renderHomeFlag(homeFlag) {
  $('.flag-1').append(getFlagPicture(homeFlag));
}

function renderAwayFlag(awayFlag) {
  $('.flag-2').append(getFlagPicture(awayFlag));
}



$(showCurrentGames)