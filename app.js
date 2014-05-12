var port = process.env.PORT || 3009;

var express = require('express');
var app = express();


var ch =  require('./chess.js/chess.js');


// Init
var tournamentRound = 0;
var noOfGames = 5;
var games = [];
var totalGameTime = 6120*2;
var speedMultiplier = 30;

//startTournament();

console.log("listen on port: " + port);
app.listen(port);

var fullPgnGames = [];

var roundStarted;


// ------------------------------------------------------------
// ---   functions
// ------------------------------------------------------------

app.get('/', function(req, res){
  startTournament();
  res.send("Start round with GET /live/start/:round");
});

app.get('/live/start/:round', function(req, res){

  var roundNo = req.params.round;

  roundStarted = new Date();

  var request = require("request");

  request("http://common.liveschach.net/norwaychess2013/" + roundNo + "/games.pgn", function(error, response, body) {

    var split = body.split('[Event "Norway Chess"');


    fullPgnGames[0] = '[Event "Norway Chess"' + split[1]+ '"' ;
    fullPgnGames[1] = '[Event "Norway Chess"' + split[2]+ '"' ;
    fullPgnGames[2] = '[Event "Norway Chess"' + split[3]+ '"' ;
    fullPgnGames[3] = '[Event "Norway Chess"' + split[4]+ '"' ;
    fullPgnGames[4] = '[Event "Norway Chess"' + split[5]+ '"' ;

    console.log(fullPgnGames[0]);

    res.send("Round started. Round: " + roundNo + "\nFollow it live on /live\n");

  });
});


app.get('/live', function(req, res){

  var now = new Date();

  var startI = roundStarted.getTime() / 1000;
  var nowI = now.getTime() / 1000;

  var roundTimeElapsed = Math.round(nowI-startI) * speedMultiplier;
  console.log("seconds in game:" + roundTimeElapsed);


  var fullPgnFile = fullPgnGames.reduce(function(previousValue, currentValue, index, array){
    return previousValue + pgnFilterdByTime(currentValue, roundTimeElapsed);
  },"");

  //console.log(fullPgnFile);



  res.send(fullPgnFile);

});



function pgnFilterdByTime(pgnGame, theTime){



    var find = 0;
    var finished = false;

    var re = "%clk";
    var str = pgnGame;

    var lastFoundWithinTimelimit = str.indexOf("%clk") - 8;
    var index = 0;

    var totTime = totalGameTime;
    var timeLeft1 = totTime /2;
    var timeLeft2 = totTime /2;

    while (true){

      index = str.indexOf(re, index);

      if (index===-1)
         break;


      index = index + 4;

      var sMoveTime = str.substr(index,8);

      var thisPlayerLeft = (parseInt(sMoveTime.substr(0,2)) * 60 * 60) +
                      (parseInt(sMoveTime.substr(3,2)) * 60) +
                      (parseInt(sMoveTime.substr(6,2)));

      timeLeft1 = timeLeft2;
      timeLeft2 = thisPlayerLeft;

      var thisTime = totTime - (timeLeft1 + timeLeft2);

      console.log("thisTime > theTime" + thisTime + " > " + theTime)



      if (thisTime > theTime)
        break;

      lastFoundWithinTimelimit = index;

      console.log("lastFoundWithinTimelimit" + lastFoundWithinTimelimit);

      index = index + 4;

    }

    return pgnGame.substr(0,lastFoundWithinTimelimit-6) + "\n\n";
}








app.get('/gamefeed/:round', function(req, res){
  var request = require("request");

  var roundNo = req.params.round;

  request("http://common.liveschach.net/norwaychess2013/" + roundNo + "/games.pgn", function(error, response, body) {
    console.log(body);
    res.send(body);
  });
});
