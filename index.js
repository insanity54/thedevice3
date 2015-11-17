var path = require('path');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config.json');
var redis = require('redis');
var util = require('util');
var EventEmitter = require('events');
//var game = require(path.join(__dirname, 'game'));

var publisher = redis.createClient();
var subscriber = redis.createClient();
app.use(express.static(path.join(__dirname, 'dist')));




var masterPassword = config.masterPassword;
var userPassword;
var clients = [];


if (typeof (masterPassword) === 'undefined') throw new Error('master password was not configured in config.json');




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
  //console.log(data);

  // requested action start
  //   if game already in progress, return an error
  //   otherwise start requested game
  if (acti === 'star') {
    console.log('(index.js) requested action start');
    publisher.get('game:isInProgress', function (err, reply) {
      if (err) return cb('database error! ' + err);
      if (reply == 1) {
        publisher.get('game:isPaused', function (err, reply) {
          if (err) return cb('database error! ' + err);
          if (reply == 1) {
            console.log('game paused so unpause');
            // game paused, unpause it
            publisher.publish('game', mode + ' star');
            return cb(null, mode + ' unpaused');
          } else {
            console.log('game not paused, err');
            publisher.publish('game', mode + ' star');
            return cb('cant start game since game already in progress');
          }
        });
      }

      // game is not in progress, start
      else {
        console.log('game not in progress, starting');
        publisher.publish('game', mode + ' star');
        return cb(null, mode + ' started');
      }
    });
  }

  // requested action stop
  //   if game not in progress, return an error
  //   otherwise stop
  else if (acti === 'stop') {
    console.log('(index.js) requested action stop');
    publisher.get('game:isInProgress', function (err, reply) {
      if (err) return cb('database error! ' + err);
      if (reply == 0) return cb('cant start stop game since no game is running');
      publisher.publish('game', mode + ' stop');
      return cb(null, mode + ' stopped');
    });
  }

  // requested action pause
  //   if game not started, return an error
  //   if game already paused, unpause
  //   otherwise pause
  else if (acti == 'paus') {
    console.log('(index.js) requested action pause');
    publisher.get('game:isInProgress', function (err, reply) {
      if (err) return cb('database error! ' + err);
      if (reply == 0) return cb('cant pause game since no game is in progress');

      publisher.get('game:isPaused', function (err, reply) {
        if (err) return cb('database error! ' + err);
        if (reply == 1) {
          publisher.publish('game', mode + ' paus');
          return cb(null, mode + ' unpaused');
        }

        // not paused so pause
        else {
          publisher.publish('game', mode + ' paus')
          return cb(null, mode + ' paused');
        }
      });
    });
  }

  // requested action stat
  //   this is a game stat update from another module
  else if (acti == 'stat') {

    console.log('(index.js) requested action stat ' + stat);


  }
}





var guiEvent = new EventEmitter();






// listen for client connections
io.on('connection', function (socket) {
  // log this client. first client connected is master, sets password
  console.log('io connection');
  clients.push(socket.id);


  socket.on('mode', function (data) {
    socket.broadcast.emit('admin', data);
    console.log(data);
  });

  guiEvent.on('guiUpdate', function (data) {
    console.log('  * socket sending guiUpdate ');
    console.log(data);
    socket.broadcast.emit('game', data);
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


  socket.on('button', function (data) {
    if (data.blu) return publisher.publish('game', 'button blu');
    if (data.red) return publisher.publish('game', 'button red');
  });

  socket.on('disconnect', function (socket) {
    // remove this client connection
    for (var c = 0; c < clients.length; c++) {
      if (clients[c] === socket.id) clients.splice(c, 1);
    }
    guiEvent.removeListener('guiUpdate', function () {
      console.log('removed one guiUpdate listener now there are ' + guiEvent.listenerCount('guiUpdate'));
    });
  });
});




// listen for messages from other modules
subscriber.subscribe('game');



//    socket.on('disconnect', function() {
//	    //subscriber.quit();
//	    console.log('socket DISCONNECT');
//	    //	    sub.off();
//	    console.log(ubscriber);
//	});



subscriber.on('message', function (channel, message) {
  console.log('    >>>> updatewebui ' + channel + ' ' + message);
  if (channel == 'game') {

    message = message.split(' ');
    var mode = message[0];
    var acti = message[1];
    console.log('message rec on chan game. mode=' + mode + ' acti=' +  acti);


    if (acti == 'stat') {
      console.log('  ]] stat received');
      console.log(message);

      var redc = message[2].split('=')[1];
      var bluc = message[3].split('=')[1];
      var redp = message[4].split('=')[1];
      var blup = message[5].split('=')[1];


      guiEvent.emit('guiUpdate', {
        "disp": {
          "redc": redc,
          "bluc": bluc
        }
      });
      //socket.emit('game', { "disp": { "red

    }


    // game ended by admin
    else if (acti == 'end') {
      console.log('  ]] end event rec');
      guiEvent.emit('guiUpdate', {
        "end": true
      });
    }


    // game ended by win condition
    else if (acti == 'win') {
      console.log('  ]] WIN event rec');
      var color = message[2];
      guiEvent.emit('guiUpdate', {
        "win": true,
        "color": color
      });
    }
  }
});









// start http server
var port = 3000;
http.listen(port, function () {
  console.log('listening on port ' + port);
});