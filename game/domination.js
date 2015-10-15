var moment = require('moment');


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
var timeLastIncrement;


var testWinCondition = function testWinCondition() {
    if (redCounter >= timeToWin) return endGame('red');
    if (bluCounter >= timeToWin) return endGame('blu');
};
    
var endGame = function increment() {
    isGameOn = 0;
};

var incrementCounter = function incrementCounter() {
    if (button.isRed) calcIncrement('red');
    if (button.isBlu) calcIncrement('blu');
};

var calcIncrement = function calcIncrement(color) {
    var incrementAmount = moment().valueOf() - timeLastIncrement;
    if (color === 'red') return redCounter += incrementAmount;
    if (color === 'blu') return bluCounter += incrementAmount;
};

var begin = function begin(time) {

    isGameOn = 1;
    timeToWin = time || ((1000 * 60) * 15); // 15 minute default
    
    // GAME LOOP
    // ---------
    //
    // check every 1 second
    var gameLoop = setInterval(function() {
	    
	    testWinCondition();

	    incrementCounter();
	    
	    // stop loop if game over
	    if (!isGameOn) {
		clearInterval(gameLoop);
	    }	
	}, 1000);
};


module.exports = {
    begin: begin
};
	    


