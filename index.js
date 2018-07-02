const todayMatchApi = "https://worldcup.sfg.io/matches/today";

function showCurrentGames(){
  $('.current-game-button').click(function(){
    
  })
}

function generateCurrentMatch() {

}

function getSoccerApi(callback) {
  const params = {url: todayMatchApi, data: {by_date: "desc"}, success: callback }
  $.ajax(params);
}

function updateInfo(data){
  let dataApi = data;
  let giantList = dataApi.map()
  
}

function renderListItem(item) {
  return 
}





$(showCurrentGames)