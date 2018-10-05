var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//Whenever someone enters/refreshes the page:
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('Message sent: ' + msg);
  });

  socket.on('send-nickname', function(msg){
  	users.push(msg);
  	console.log(msg + " has entered the chatroom.");
    console.log("All users: " + users);
    io.emit('new-user', msg);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

//Send event to everyone:
io.emit('some event', { for: 'everyone' });
