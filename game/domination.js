var moment = require('moment');
var redis = require('redis');
var button = require('./button');



var red = redis.createClient();

// loop
// instead of sync loop, register events
//while (gameOn) {
    
//}


// game model
//   - blueCounter  (number)
//   - redCounter   (number)
//   - timeToWin    (number)
//   - isInProgress (0|1)
//   - controlledBy (red|blu)


// node event loop {
//
//
//   test win condition
//     if red counter >= timeToWin; red win
//     if blu counter >= timeToWin; blu win
//
//
//   /** PUT THIS IN A DIFFERENT MODULE */
//   get button status
//     if red button last pressed; controlledBy = red
//     if blu button last pressed; controlledBy = blu
//
//
//   increment counters
//     if controlled by red; increment redCounter
//     if controlled by blu; increment bluCounter
//
//
//   view
//     - displays red progress LED depending on model.redCounter
//     - displays blu progress LED depending on model.bluCounter
//
//
// }

"use strict";


var redCounter;
var bluCounter;
var timeToWin;
var timeStart;
var timeLastIncrement;
var isInProgress;
var isPaused;


var testWinCondition = function testWinCondition() {
    console.log('  * test win condition (' + redCounter + ' >= (' + timeStart + ' + ' + timeToWin + '))');
    if (redCounter >= timeToWin) return endGame('red');
    if (bluCounter >= timeToWin) return endGame('blu');
};
    
var endGame = function endGame(color) {
    console.log("WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER " + color);
    isInProgress = 0;
    red.set('game:isInProgress', isInProgress);

    if (color) return red.publish('game', 'domi win ' + color);
    return red.publish('game', 'domi end');
};

var incrementCounter = function incrementCounter() {
    //console.log('incrementCounter runs. btnred- ' + button.getActiveColor() + ' btnblu-' + button.getActiveColor());
    if (button.getActiveColor() == 'red') calcIncrement('red');
    if (button.getActiveColor() == 'blu') calcIncrement('blu');
};

/** calculates time between this tick and last tick */
var calcIncrement = function calcIncrement(color) {
    console.log('calcIncrement ' + color);

    if (isPaused == 0) {
	var incrementAmount = moment().valueOf() - (timeLastIncrement || moment().valueOf());
    } else {
	var incrementAmount = 0;
    }
    console.log('incrBy ' + incrementAmount);
    if (color === 'red') redCounter += incrementAmount;
    if (color === 'blu') bluCounter += incrementAmount;
    timeLastIncrement = moment().valueOf();
};

var updateNetwork = function() {
    var redPercentage = parseInt((redCounter / timeToWin) * 100); // get red percentage
    var bluPercentage = parseInt((bluCounter / timeToWin) * 100); // get blu percentage
    red.set('game:isInProgress', isInProgress);
    red.publish('game',
			'domi stat ' +
			'redc=' + redCounter + ' ' +
			'bluc=' + bluCounter + ' ' +
			'redp=' + parseInt((redCounter / timeToWin) * 100) + ' ' +
			'blup=' + parseInt((bluCounter / timeToWin) * 100));
};


var debug = function() {
    console.log('(dominatino.js) DEBUG - timeLastIncrement ' + timeLastIncrement + ' ttw ' + timeToWin + ', timeStart ' + timeStart + ', redCounter ' + bluCounter + ', bluCounter');
}

var begin = function begin(time) {

    // reset everything
    isInProgress = 1;
    red.set('game:isInProgress', 1);
    isPaused = 0;
    red.set('game:isPaused', 0);
    
    timeToWin = time || ((1000 * 60) * 1); // 1 minute default
    timeStart = moment().valueOf();
    bluCounter = 0;
    redCounter = 0;
    timeLastIncrement = 0;
    
    button.reset();
    

    console.log('domination.js begin! ttw=' + timeToWin + ' ts=' + timeStart + ' bluc=' + bluCounter + ' redc=' + redCounter);
    
    
    // GAME LOOP
    // ---------
    //
    // check every 1 second
    var gameLoop = setInterval(function() {

	    testWinCondition();

	    incrementCounter();

	    debug();

	    updateNetwork();
	    
	    // stop loop if game over
	    if (!isInProgress) {
		clearInterval(gameLoop);
	    }

	}, 1000);
};


var stop = function stop() {
    isInProgress = 0;
    red.set('game:isInProgress', 0);
};


var pause = function pause() {
    if (isPaused == 1) {
	// unpause
	isPaused = 0;
	red.set('game:isPaused', 0);
    }
    else {
	isPaused = 1;
	red.set('game:isPaused', 1);
    }
}


module.exports = {
    begin: begin,
    stop: stop,
    pause: pause
};



