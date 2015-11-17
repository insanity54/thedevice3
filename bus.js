// bus.js
// I'm using this name because it's inspired by a car's CAN bus.
// It's a data stream that different devices can listen to and publish to.
// it's basically an interface to the redis server


var redis = require('redis');
var red = redis.createClient();

var isGameInProgress = function isGameInProgress() {
  red.get('game:isInProgress', function(err, reply) {
    if (err) throw err;
    if (reply == 1) return 1;
    return 0;
  });
}