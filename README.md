# The Device

Airsoft multi device that facilitates cool game modes from popular video games.


## Architecture

### Summary

uses Node.js and Redis

Server/client model. The device itself runs the node and redis server. Clients (admin and player's cell phones) connect using a web browser. Using express, the node server serves pages which will dynamically update using sockets.io and jquery.

index.js serves pages, handles socket.io connections, and pub/subs to redis. game/*.js handles the gameplay of the different types of games


### Processes

The device runs @todo n node processes, and one redis process. These processes are built to be loosely coupled so in the future, redis server could be moved to a different place or sharded.

* Process 0 `pm2` handles running the other processes and keeping them alive
* Process 1 `redis-server` is the redis server
* Process 2 (node ./index.js) is the server which serves page to clients, handles socket.io, handles publishing to redis
* Process 3 (node ./game/*.js) daemon which runs the game mode


//* Process 2 (node ./game/index.js) is a redis listener which is not yet hashed out @TODO



### Detail


#### Pub/Sub (Redis)

There is one channel so far, game. Game statuses are published to redis, and listeners to the redis messages see the messages and react accordingly.

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

* [ ] hide the timer until a game mode is pressed or a game is already in progress 
* [ ] brandon-proof the GUI
  * "I want to know what you _don't_ like"
  
  
## Future plans

Because of thedevice's modularity, a device could be extremely lightweight. A device could simply be a couple phsical pushbuttons connected to an ESP8266. A button press could be read, and a redis-compatible message sent over the network, where another device, or light show, pyro fx would appropriately be triggered. 