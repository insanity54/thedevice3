$(document).ready(function () {

  console.log('admin script ready');

  var socket = io();

  socket.on('admin', function (data) {
    console.log('got admin message');
    console.log(data);
    if (typeof (data.pass) !== 'undefined') $("#info-pass").html(data.pass);
    if (typeof (data.mode) !== 'undefined') $("#info-mode").html(data.mode);
    if (typeof (data.acti) !== 'undefined') $("#info-acti").html(data.acti);
    if (typeof (data.mess) !== 'undefined') $("#info-mess").html(data.mess);
  });
});