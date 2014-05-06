var port = process.env.PORT || 3009;

var express = require('express');
var app = express();


var ch =  require('./chess.js/chess.js');

var tournamentRound = 1;

var noOfGames = 5;

var games = [];

for(var i=0;i<noOfGames;i++){
  games[i] = ch.Chess();
}

setInterval(function(){
  for(var i=0;i<noOfGames;i++){
    nextMove(games[i], i);
  }
}, 10000);

function nextMove(game, gameNo){
  if (game.game_over()){
    console.log("game over in game " + gameNo);
    return;
  }


  var moves = game.moves();
  var move = moves[Math.floor(Math.random() * moves.length)];
  game.move(move);

  console.log("game " + gameNo + ": " + move);

}

app.get('/pgnfeed', function(req,res){

  var total = [];

  for(var i=0;i<noOfGames;i++){
    total.push(getMockPgn(games[i], i));
  }

  var ret = total.join("\n");

  res.send(ret);

});

function getMockPgn(game, i){
  var pgnH = [];
  pgnH.push('[Event "Dolhpin Cup 2014"]');
  pgnH.push('[Site "Bergen NOR"]');
  pgnH.push('[Date "2014.05.09"]');
  pgnH.push('[EventDate "2014.05.07"]');
  pgnH.push('[Round "1"]');
  pgnH.push('[White "Player ' + (i*2+1)  +   '"]');
  pgnH.push('[Black "Player ' + (i*2+2)  +   '"]');

  return pgnH.join("\n") + game.pgn();
}


console.log("listen on port: " + port);
app.listen(port);
