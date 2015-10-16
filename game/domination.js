var moment = require('moment');
var redis = require('redis').createClient();
var button = require('./button');


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


var redCounter = 0;
var bluCounter = 0;
var timeToWin;
var timeStart;
var timeLastIncrement;
var isInProgress;


var testWinCondition = function testWinCondition() {
    console.log('  * test win condition (' + redCounter + ' >= (' + timeStart + ' + ' + timeToWin + '))');
    if (redCounter >= (timeStart + timeToWin)) return endGame('red');
    if (bluCounter >= (timeStart + timeToWin)) return endGame('blu');
};
    
var endGame = function endGame(color) {
    console.log("WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER WINNER " + color);
    isInProgress = 0;
    redis.set('game:isInProgress', isInProgress);

    if (color) redis.publish('game', 'domi win ' + color);
    redis.publish('game', 'domi end');
};

var incrementCounter = function incrementCounter() {
    console.log('incrementCounter runs. btnred- ' + button.getActiveColor() + ' btnblu-' + button.getActiveColor());
    if (button.getActiveColor() == 'red') calcIncrement('red');
    if (button.getActiveColor() == 'blu') calcIncrement('blu');
};

var calcIncrement = function calcIncrement(color) {
    console.log('calcIncrement ' + color);
    var incrementAmount = moment().valueOf() - (timeLastIncrement || 0);
    console.log('incrBy ' + incrementAmount);
    if (color === 'red') redCounter += incrementAmount;
    if (color === 'blu') bluCounter += incrementAmount;
    timeLastIncrement = moment().valueOf();
};

var updateNetwork = function() {
    var redPercentage = parseInt((redCounter / timeToWin) * 100); // get red percentage
    var bluPercentage = parseInt((bluCounter / timeToWin) * 100); // get blu percentage
    redis.set('game:isInProgress', isInProgress);
    redis.publish('game',
			'domi stat ' +
			'redc=' + redCounter + ' ' +
			'bluc=' + bluCounter + ' ' +
			'redp=' + parseInt((redCounter / timeToWin) * 100) + ' ' +
			'blup=' + parseInt((redCounter / timeToWin) * 100));
};


var debug = function() {
    console.log('(dominatino.js) DEBUG - timeLastIncrement ' + timeLastIncrement + ' ttw ' + timeToWin + ', timeStart ' + timeStart);
}

var begin = function begin(time) {

    console.log('domination.js begin');
    
    isInProgress = 1;
    timeToWin = time || ((1000 * 60) * 1); // 1 minute default
    timeStart = moment().valueOf();
    
    
    // GAME LOOP
    // ---------
    //
    // check every 1 second
    var gameLoop = setInterval(function() {

	    testWinCondition();

	    incrementCounter();

	    debug();
	    
	    // stop loop if game over
	    if (!isInProgress) {
		clearInterval(gameLoop);
	    }

	    updateNetwork();

	    
	}, 1000);
};


var stop = function stop() {
    isInProgress = 0;
    redis.set('game:isInProgress', 0);
};


module.exports = {
    begin: begin,
    stop: stop
};