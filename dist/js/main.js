$(document).ready(function () {

  var socket = io();
  var activeMode = '';
  console.log(moment().format());

  // MODE BUTTONS
  $("#btn-bomb").click(function () {
    console.log('bomb button clicked');
    socket.emit('mode', {
      'mode': 'bomb',
      'pass': $("#form-pass").val()
    });
    activeMode = 'bomb';
    return false;
  });

  $("#btn-inte").click(function () {
    console.log('intel button clicked');
    socket.emit('mode', {
      'mode': 'inte',
      'pass': $("#form-pass").val()
    });
    activeMode = 'inte';
    return false;
  });

  $("#btn-domi").click(function () {
    console.log('domination button clicked');
    socket.emit('mode', {
      'mode': 'domi',
      'pass': $("#form-pass").val()
    });
    activeMode = 'domi';
    return false;
  });


  
  
  
  // GAME BUTTONS
  $("#btn-stop").click(function () {
    console.log('stop button clicked');
    
    // @todo this should happen somwehre else?
    // if there is a border, clear it
    // otherwise, emit over network
    if ( $("#timer-blu ul").css("border-top-style") || $("#timer-red ul").css("border-top-style") ) {
      console.log('clearing borders');
      $("#timer-blu ul").css("border", "");
      $("#timer-red ul").css("border", "");
    } else {
      socket.emit('game', {
      'pass': $("#form-pass").val(),
      'acti': 'stop',
      'mode': activeMode
    });
    }
  });

  $("#btn-play").click(function () {
    console.log('play button clicked');
    socket.emit('game', {
      'pass': $("#form-pass").val(),
      'acti': 'star',
      'mode': activeMode
    });
  });
      
  $("#btn-paus").click(function () {
    console.log('paus button clicked');
    socket.emit('game', {
      'pass': $("#form-pass").val(),
      'acti': 'paus',
      'mode': activeMode
    });
  });

  
  // DEBUG BUTTONS
  $("#btn-test-blu").click(function() {
    console.log('blu button clicked');
    socket.emit('button', {
      'blu': true
    });
  });
                
  $("#btn-test-red").click(function() {
    console.log('red button clicked');
    socket.emit('button', {
      'red': true
    });
  });
  
  
  // socket events
  socket.on('game', function(data) {
    //console.log('got game message');
    //console.log(data);
    if (typeof(data.err) !== 'undefined') return flash('danger', data.err);
    if (typeof(data.msg) !== 'undefined') return flash('success', data.msg);
    
    if (typeof(data.disp) !== 'undefined') return updateDisplay(data.disp);
    if (typeof(data.end) !== 'undefined') return endGame();
    if (typeof(data.win) !== 'undefined') return winGame(data);
  });
  
  
  
  var winGame = function winGame(data) {
    if (data.color == 'red') $("#timer-red ul").css("border", "3px solid goldenrod");
    if (data.color == 'blu') $("#timer-blu ul").css("border", "3px solid goldenrod");
  }
  
  var endGame = function endGame() {
    console.log('end game');
    $("#timer-red-display").html('');
    $("#timer-blu-display").html('');
    $("#timer-blu ul").css("border", "");
    $("#timer-red ul").css("border", "");
  }
  
  
  
  var updateDisplay = function updateDisplay(data) {
    //console.log('updating display');
    console.log(data);
    // @todo optimize by only update if change since last update
    
    // crazy hax to get a properly formatted timer.
    bluMinutes = moment.duration(parseInt(data.bluc)).format('mm');
    bluSeconds = parseInt(moment.duration(parseInt(data.bluc)).asSeconds() % 60);
    if (bluSeconds < 10) bluSeconds = '0' + bluSeconds.toString();
    
    redMinutes = moment.duration(parseInt(data.redc)).format('mm');
    redSeconds = parseInt(moment.duration(parseInt(data.redc)).asSeconds() % 60);
    if (redSeconds < 10) redSeconds = '0' + redSeconds.toString();
    
    $("#timer-red-display").html(redMinutes + ':' + redSeconds);
    $("#timer-blu-display").html(bluMinutes + ':' + bluSeconds);
  }
  
  
  var flash = function flash(type, message) {
    if (type == 'danger') {
      $("#log ul").append("<li class=\"danger\">" + message + "</li>");
    }
    if (type == 'success') {
      $("#log ul").append("<li class=\"success\">" + message + "</li>");
    }
    if (typeof(type) == 'undefined') {
      $("#log ul").append("<li class=\"info\">" + message + "</li>");
    }
    
    var log = $("#log");
    log.scrollTop(log[0].scrollHeight);
  }
  
  
});