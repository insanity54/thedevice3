// gets physical button status of thedevice

var redis = require('redis').createClient();


var isRed = false;
var isBlu = false;




var setControl = function setControl(color) {
    console.log('setting control ' + color);
    if (color === 'blu') {
	isBlu = true;
	isRed = false;
    }
    else if (color === 'red') {
	isBlu = false;
	isRed = true;
    }
    console.log('results isBlu ' + isBlu + ' isRed ' + isRed);
}
 

    var getActiveColor = function getActiveColor() {
	if (isRed) return 'red';
	if (isBlu) return 'blu';
    }


redis.subscribe('game');

redis.on('message', function(channel, message) {
	if (channel === 'game') {
	    //console.log('button.js - got message');
	    //console.log(message);

	    //domi stat redc=0 bluc=0 redp=0 blup=0

	    message = message.split(' ');
	    var mode = message[0];
	    var action = message[1];

	    if (mode == 'button') {
		console.log("BUTTON PRESS " + action);
		if (action == 'blu') return setControl('blu');
		if (action == 'red') return setControl('red');
	    }

	}
    });





module.exports = {
    getActiveColor: getActiveColor
}