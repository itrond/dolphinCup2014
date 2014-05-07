var port = process.env.PORT || 3009;

var express = require('express');
var app = express();


var ch =  require('./chess.js/chess.js');


// Init
var tournamentRound = 0;
var noOfGames = 5;
var games = [];

startTournament();

console.log("listen on port: " + port);
app.listen(port);


// functions:

function startTournament(){

  tournamentRound++;

  games = [];

  for(var i=0;i<noOfGames;i++){
    games[i] = ch.Chess();
  }

  setInterval(function(){
      var allGamesOver=true;
      for(var i=0;i<noOfGames;i++){
        if (!games[i].game_over()){
          nextMove(games[i], i);
          allGamesOver=false;
        }
        else{
          console.log("game over in game " + i);
        }
      }

      if (allGamesOver){
        console.log("Round is finished");
        console.log("-------------------");
        console.log("--- New round -----");
        console.log("-------------------");
        startTournament();
      }

  }, 10000);
}

function nextMove(game, gameNo){

  var moves = game.moves();
  var move = moves[Math.floor(Math.random() * moves.length)];
  game.move(move);

  console.log("game " + gameNo + ": " + move);

}

app.get('/', function(req, res){
  startTournament();
  res.send("New tourment started. Go to /pgnfeed to se the live feed");
});

app.get('/pgnfeed', function(req,res){

  var total = [];

  for(var i=0;i<noOfGames;i++){
    total.push(getMockPgn(games[i], i));
  }

  var ret = total.join("\n");

  res.send(ret);

});

app.get('/gamefeed/:round', function(req, res){
  var request = require("request");

  var roundNo = req.params.round;

  console.log(roundNo);

  request("http://common.liveschach.net/norwaychess2013/" + roundNo + "/games.pgn", function(error, response, body) {
    console.log(body);
    res.send(body);
  });
});

function getMockPgn(game, i){
  var pgnH = [];
  pgnH.push('[Event "Dolhpin Cup 2014"]');
  pgnH.push('[Site "Bergen NOR"]');
  pgnH.push('[Date "2014.05.09"]');
  pgnH.push('[EventDate "2014.05.07"]');
  pgnH.push('[Round "'+ tournamentRound+'"]');
  pgnH.push('[White "Player ' + (i*2+1)  +   '"]');
  pgnH.push('[Black "Player ' + (i*2+2)  +   '"]');

  return pgnH.join("\n") + game.pgn();
}
