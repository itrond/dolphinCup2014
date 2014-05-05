var port = process.env.PORT || 3009;

var express = require('express');
var app = express();

//var bodyParser = require('body-parser');
//app.use(bodyParser());

//var ch =  require('./chess.js/chess.js');

app.get('/pgnfeed', function(req,res){

  res.sendfile('public/anand-carlsen-2013.pgn');

});



app.listen(port);
