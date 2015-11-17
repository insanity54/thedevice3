/**
 * listener
 *
 * listens to redis. exports an interface for other modules to listen to the listener.
 *
 * if there are listeners listening to the listener, an event is fired to the listener's listeners.
 */


var EventEmitter = require('events').EventEmitter;
var util = require('util');
var path = require('path');
var nconf = require('nconf');
var assert = require('chai').assert;

nconf.file(path.join(__dirname, 'config.json'));
var redisOpts = nconf.get('redis_client_options');
var red = redis.createClient(redisOpts);





/**
 * Listener constructor
 */
var Listener = function() {
  // this.listeners shows events listened to
  
  EventEmitter.call(this);
}



/**
 * examples
 *
 * external modules can call Listener like this
 *
 *   
 * var l = new Listener();
 * l.addListener('domi');
 * l.on('domi',  callback);
 *
 */





util.inherits(Listener, EventEmitter);

module.exports = Listener;