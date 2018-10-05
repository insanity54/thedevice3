# The D3VICE

[![Greenkeeper badge](https://badges.greenkeeper.io/insanity54/thedevice3.svg)](https://greenkeeper.io/)

## DEPRECATED. See https://github.com/doomsquadairsoft/d3vice-gameserver

Airsoft multi-device that facilitates cool game modes from popular video games.

## Other Cool Codename Ideas

  * Delta 3 NET
  * D-NET (D3 NET)
  * Delta 3 Vice
  * Vic 3 Delta
  * Three Saint
  * Saint3
  * Device Mk3
  * AStrat3 (Airsoft Strategy Three)
  * S3-TAC


## Architecture

### Summary

uses Node.js and Redis

Server/client model. The D3vice itself runs the node and redis server. Clients (admin and player's cell phones) connect using a web browser. Using express, the node server serves pages which will dynamically update using sockets.io and jquery.

index.js serves pages, handles socket.io connections, and pub/subs to redis. Files matching `game/*.js` handles the gameplay of the different types of games


### Processes

D3vice runs a number of processes. `@todo` _n_ node processes, and one redis process. These processes are built to be loosely coupled so in the future, the Redis server could be moved to a different place or sharded.

* Process 0 `pm2` handles running the other processes and keeping them alive
* Process 1 `redis-server` is the redis server
* Process 2 (node `./index.js`) is the server which serves page to clients, handles socket.io, handles publishing to redis
* Process 3 (node `./game/*.js`) is the daemon which runs the game


// * Process 2 (node ./game/index.js) is a redis listener which is not yet hashed out @TODO


### Features

Every device is assigned a set of features. These features are what the device _can_ provide to the network of devices. A game administrator, using the web GUI, is able to look at a list of all the devices on the device network, and set up how each individual device should interact with game events based on their available features.

Features are assigned to Devices based on the hardware of the Device. For example, a D3vice with two pushbuttons and no displays won't have an LCD feature, it would have an input feature. Hardware is defined in each device's [config.json](https://github.com/insanity54/thedevice3/wiki/config.json)




#### Pub/Sub (Redis)

There is one Redis channel so far, `game`. Game statuses are published to Redis, and listeners to the Redis messages see the messages and react accordingly. Listeners can be other D3vices or different processes running on a single D3vice.

game - messages for the active game

example: publisher.publish('game', mode + ' paus');

the messages are in format `[MODE] [ACTION]` where mode is the game mode. Mode can be up to four letters long. Action is the action to take, such as start/stop, and is also up to four letters.

##### Game modes

* `domi` - domination (COD)
* `inte` - intel (TF2)
* `bomb` - bomb (CS)

##### Actions

* `star` - start
* `stop` - stop
* `paus` - pause
* `win` - a team has won the game
* `end` - game administratively ended
* `prep` - preparation mode
* `stat` - game statistics




## Todo

* [ ] Hide the timer until a game mode is pressed or a game is already in progress
* [ ] User-proof the GUI
  * "I want to know what you _don't_ like"
  * [ ] Russell
  * [ ] Brandon
  * [ ] Scott
  * [ ] Mike


## Future plans

Because of D3vice modularity, a D3vice could be extremely lightweight. A D3vice could simply be a couple physical pushbuttons connected to an ESP8266. A button press could be read, and a redis-compatible message sent over the network, where another D3vice, or light show/pyroFX would appropriately be triggered.
