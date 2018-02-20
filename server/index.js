var http = require('http').Server();
var io = require('socket.io')(http);

io.on('connection', function(socket){

  socket.on('join room', function(roomId){
    socket.join(roomId);
    console.log(socket.id, ' joined room ', roomId)
    console.log(socket.rooms);
  });
});

http.listen(3000, function(){
  console.log('listening on port 3000');
});
