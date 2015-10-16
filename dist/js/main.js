$(document).ready(function () {

  var socket = io();
  var activeMode = '';

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
    socket.emit('game', {
      'pass': $("#form-pass").val(),
      'acti': 'stop',
      'mode': activeMode
    });
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
  })
  
  
  
  var updateDisplay = function updateDisplay(data) {
    $("#timer-red-display") 
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