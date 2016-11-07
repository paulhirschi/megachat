var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', process.env.PORT || 9000);
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var people = {};

io.on('connection', function(socket) {
  console.log('user connected');
  socket.on('join', function(name) {
    people[socket.id] = name;
    io.emit('update', name + ' joined');
    io.emit('update-people', people);
  });
  socket.on('disconnect', function() {
    console.log('user disconnected');
    delete people[socket.id];
    io.emit('update-people', people);
  });
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
  socket.on('user typing', function(info) {
    io.emit('user typing', info);
  });
});

http.listen(app.get('port'), function(err) {
  if(err) {console.log('Check your shizzle, unable to initiate server.');}
  console.log('app at ' + http.address().port);
});