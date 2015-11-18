'use strict';
var path = require('path');
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 5000;
app.use('/static', express.static(__dirname + "/dist"));
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, './dist/index.html'));
});
app.get('/snake.js', function(req, res){
	res.sendFile(path.join(__dirname, '/dist/snake.js'));
});
io.sockets.on('connection', function(socket){
    console.log('sockets connected');
    let roomId;

    let client = socket;

    if ( roomId === undefined ) {
    	roomId = Math.random() * 100000;
    }

    client.join(roomId.toString());
    
    client.emit('connected', { message: 'Player 1 arrived', mySocketId: client.id, gameId: roomId });

    



});
server.listen(port, () => {
	console.log('server listening on port' + port);
});
module.exports = app;