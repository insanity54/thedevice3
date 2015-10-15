$(document).ready(function() { 
    
    var socket = io();

    
    $("#btn-bomb").click(function() {
        console.log('bomb button clicked');
        socket.emit('mode', { 'mode': 'bomb', 'pass': $("#form-pass").val() });
        return false;
    });
    
    $("#btn-inte").click(function() {
        console.log('intel button clicked');
        socket.emit('mode', { 'mode': 'inte', 'pass': $("#form-pass").val() });
        return false;
    });
         
    $("#btn-domi").click(function() {
        console.log('domination button clicked');
        socket.emit('mode', { 'mode': 'domi', 'pass': $("#form-pass").val() });
        return false;
    });
});