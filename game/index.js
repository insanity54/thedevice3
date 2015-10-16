var domination = require('./domination');
var intel = require('./intel');
var bomb = require('./bomb');
var redis = require('redis');

var red = redis.createClient();


red.subscribe('game');


// when receiving a message such as
// inte paus
// domi star
// bomb stop
// domi prep
//   if valid command, carry out the operation
red.on('message', function(channel, message) {
	//console.log('(./game/index.js) - got game message ' + message + ' on channel ' + channel);
	if (channel === 'game') {

	    
	    // validate
	    var msg = message.split(' ');
	    if (msg.length !== 2) return false;
	    var mode = msg[0];
	    var action = msg[1];

	    //console.log('(./game/index.js) - mode is ' + mode + ', action is ' + action);
	    
	    if (mode !== 'inte' && mode !== 'domi' && mode !== 'bomb') {
		//console.log('fail mode check');
		return false;
	    }

	    if (action !== 'star' && action !== 'stop' &&
		action !== 'paus' && action !== 'prep') {
		console.log('fail action check');
		return false;
	    }

	    // take action
	    if (action === 'star') {
		console.log('taking action');
		return start(mode);
		
	    }
	    if (action === 'stop') return stop(mode);
	    if (action === 'paus') return pause(mode);
	    if (action === 'prep') return prep(mode);
	    console.log('not taking action');
	}
    });




// messages we can receive on channel game
//
//   [mode] (prep|star|stop|paus)
//     ex: domi prep
//     ex: bomb prep
//     ex: inte pause
//

// messages we can publish on channel game
//
//   [mode] win param
//     ex: domi win red
//     ex: bomb win
//


//var isInProgress = 0;



var start = function start(mode) {
  console.log('(pseudo) starting mode ' + mode);

  if (mode == 'domi') return domination.begin();
  if (mode == 'bomb') return bomb.begin();
  if (mode == 'inte') return intel.begin();
  
  return false;
};

var stop = function stop(mode) {
  console.log('(pseudo) stopping mode ' + mode);

  if (mode == 'domi') return domination.stop();
  if (mode == 'bomb') return bomb.stop();
  if (mode == 'inte') return intel.stop();  
  
  return false;
};

var pause = function pause(mode) {
  console.log('(pseudo) pausing mode ' + mode);

  return false;
};

var prep = function prep(mode) {
    console.log('(pseudo) prep mode ' + mode);
    
    
    return false;
};
    

module.exports = {
  "start": start,
  "stop": stop,
  "pause": pause,
  "domination": domination,
  "intel": intel,
  "bomb": bomb
}

