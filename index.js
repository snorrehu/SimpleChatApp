var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var linkify = require('linkifyjs/html');

var users = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//Handle connection
io.on('connection', function(socket){
  console.log('Connection established.');

  //Remove user on page close/refresh (to be updated..)
  socket.on('disconnect', function(){
  	var name = getUserName(socket.id);
  	removeUser(socket.id);
  	io.emit('user-left', name);
    console.log(name + ' disconnected with ID: ' + socket.id);
    console.log("Number of chatters: " + users.length);
  });

  //Handle chat message from client
  socket.on('chat message', function(msg){
  	var msgRecieved = {message: msg.message,user: msg.user};
  	linkifiedMessage = linkify(msgRecieved.message); 
  	var msgToSend = "<p>" + msgRecieved.user + " says: " + linkifiedMessage;

    io.emit('chat message', msgToSend);
    console.log(msg.user + " says: " + msg.message);
  });

  //Handle user info from client
  socket.on('setSocketID', function(data){
  	console.log("User info recieved from client! Name: " + data.nickName + ", ID: " + data.userID);
  	users.push(data);
  	console.log("Number of chatters: " + users.length);
    io.emit('new-user', data.nickName);
  });

});

//Listen to port:
http.listen(process.env.PORT||3000, function(){
  console.log('listening on *:3000');
});

//Send event to everyone:
io.emit('some event', { for: 'everyone' });

//Get user from ID:
function getUserName(id){
	var i;
	var name;
	for (i = 0; i < users.length; i++) { 
    	if(users[i].userID){
    		name = users[i].nickName;
    	}
	}
	return name;
}

//Get user from ID:
function removeUser(id){
	var i;
	for (i = 0; i < users.length; i++) { 
    	if(users[i].userID===id){
    		users.splice(i,1);
    		console.log("index: " + i);
    	}
	}
}
