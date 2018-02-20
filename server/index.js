var http = require('http').Server();
var io = require('socket.io')(http);

io.on('connection', function(socket){

  socket.on('join room', function(roomId){
    io.of('/').in(roomId).clients((error, inRoom) => {
      if(error) throw error;
      if(inRoom.length <= 1) {
        socket.join(roomId);
        console.log(socket.id, ' joined room ', roomId)
      }
      if(inRoom.length === 1) {
        var x = Math.floor(Math.random()*2);
        socket.emit('toss', x);
        io.sockets.connected[inRoom[0]].emit('toss', 1-x);
      }
    });
  });

  socket.on('move', function(data){
    socket.broadcast.to(data.roomId).emit('move', data.n);
    console.log('broadcasted to ', data.roomId, data.n);
  });
});

http.listen(3000, function(){
  console.log('listening on port 3000');
});
