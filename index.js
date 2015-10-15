var path = require('path');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config.json');
//var game = require(path.join(__dirname, 'game'));


app.use(express.static(path.join(__dirname, 'dist')));





var clients = [];

io.on('connection', function(socket) {
	// log this client. first client connected is master, sets password
	clients.push(socket.id);

	
	
	socket.on('mode', function(msg) {
		console.log('got ' + msg);
		console.log(msg);
	    });



	socket.on('disconnect', function(socket) {
		// remove this client connection
		for (var c = 0; c < clients.length; c ++) {
		    if (clients[c] === socket.id) clients.splice(c, 1);
		}
	    });
    });



http.listen(3000, function() {
	console.log('listening on 3000 port');
    });
