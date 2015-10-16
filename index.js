var path = require('path');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config.json');
var redis = require('redis');
var game = require(path.join(__dirname, 'game'));

var red = redis.createClient();
var red2 = redis.createClient();
app.use(express.static(path.join(__dirname, 'dist')));




var masterPassword = config.masterPassword;
var userPassword;
var clients = [];


// session
//
//
//   game messages
//     mode
//       get password
//
//         if password incorrect
//           return flash error
//
//         if password correct
//           if a game is in progress
//             return flash error
//
//
//     game(mode, action)
//       get password
//         if password is incorrect
//           return flash error
//
//         if (action) is start
//           if game is in progress
//             return flash error
//
//           if game is not in progress
//             start game (mode)
//
//         if (action) is stop
//           if game is not in progress
//             return flash error
//
//           if game is in progress
//             stop game (mode)
//
//         if (action) is pause
//           if game is stopped
//             return flash error
//
//           if game is paused
//             return flash error
//
//           if game is in progress
//             pause game (mode)
//


/**
 * procGame
 *
 * processes a socket io message of type, 'game' which is sent from the web interface
 *
 * 
 *
 */
var procGame = function procGame(data, cb) {

  "use strict";

  // expand data
  var pass = data.pass.toString();
  var acti = data.acti.toString();
  var mode = data.mode.toString();

  // validate data
  if (typeof (pass) === 'undefined') return cb('incorrect password');
  if (typeof (acti) === 'undefined') return cb('no action received');
  if (typeof (mode) === 'undefined') return cb('no mode received');


  // if the user password is not defined, use the received password as user password
  if (typeof (userPassword) === 'undefined') userPassword = pass;

  
  // reject if received password doesnt match either the user password or the master password
  if (pass !== userPassword && pass !== masterPassword) return cb('incorrect password');


  //  access granted
  console.log(data);

  // requested action start
  //   if game already in progress, return an error
  //   otherwise start requested game
  if (acti === 'star') {
      console.log('(index.js) requested action start');      
    red.get('game:isInProgress', function (err, reply) {
      if (err) return cb('database error! ' + err);
      if (reply == 1) return cb('cant start game since game already in progress');
      red.publish('game', mode + ' star');
      return cb(null, mode + ' started');
    });
  }

  // requested action stop
  //   if game not in progress, return an error
  //   otherwise stop
  else if (acti === 'stop') {
      console.log('(index.js) requested action stop');
    red.get('game:isInProgress', function (err, reply) {
      if (err) return cb('database error! ' + err);
      if (reply == 0) return cb('cant start stop game since no game is running');
      red.publish('game', mode + ' stop');
      return cb(null, mode + ' stopped');
    });
  }

  // requested action pause
  //   if game not started, return an error
  //   if game already paused, return an error
  //   otherwise pause
  else if (acti == 'paus') {
      console.log('(index.js) requested action pause');      
    red.get('game:isInProgress', function (err, reply) {
      if (err) return cb('database error! ' + err);
      if (reply == 0) return cb('cant pause game since no game is in progress');

      red.get('game:isPaused', function (err, reply) {
        if (err) return cb('database error! ' + err);
        if (reply == 1) return cb('cant pause game since game is already paused');
        red.publish('game', mode + ' paus');
        return cb(null, mode + ' paused');
      });
    });
  }

  // requested action stat
  //   this is a game stat update from another module
  else if (acti == 'stat') {
      
      console.log('(index.js) requested action stat ' + stat);

      
  }
}







// listen for client connections
io.on('connection', function (socket) {
  // log this client. first client connected is master, sets password
  clients.push(socket.id);

  
  socket.on('mode', function (data) {
	  socket.broadcast.emit('admin', data);
	  console.log(data);
  });



  socket.on('game', function (data) {
	  //console.log(' (index.js) got game socket ' + data);
    procGame(data, function (err, response) {
      if (err) return socket.emit('game', {
        "err": err
      });
      socket.emit('game', {
        "msg": response
      });
    });
  });


  socket.on('button', function(data) {
	  if (data.blu) return red.publish('game', 'button blu');
	  if (data.red) return red.publish('game', 'button red');
      });

  socket.on('disconnect', function (socket) {
    // remove this client connection
    for (var c = 0; c < clients.length; c++) {
      if (clients[c] === socket.id) clients.splice(c, 1);
    }
  });
});





var updateWebUI = function updateWebUI() {

// listen for messages from other modules
red2.subscribe('game');
red2.on('message', function(channel, message) {
	if (channel == 'game') {
	    message = message.split(' ');

	    console.log(message);
	    
	    var mode = message[0];
	    var acti = message[1];
	    var redc = message[2].split('=')[1];
	    var bluc = message[3].split('=')[1];
	    var redp = message[4].split('=')[1];
	    var blup = message[5].split('=')[1];


	    socket.emit('game', {

	    //	    [ 'domi',
	    //	      'stat',
	    //	      'redc=1445030335965',
	    //	      'bluc=0',
	    //	      'redp=2408383893',
	    //  'blup=2408383893' ]

	    
	}
    });
}








// start http server
http.listen(3000, function () {
	console.log('listening on 3000 port');
    });