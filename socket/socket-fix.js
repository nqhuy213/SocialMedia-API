
var User = require('./EventHandlers/User');

function initSocket(server) {
  var io = require('socket.io').listen(server);
  var UserSockets = {}
  io.sockets.on('connection', function (socket) {
    console.log(`Socket ${socket.id} connected`);
    // Create event handlers for this socket

    //#region Join room
    socket.on('join', (room) => {
      console.log(`Socket ${socket.id} joining ${room}`);
      socket.join(room);
    });
    //#endregion

    var eventHandlers = {
        user: new User(UserSockets, socket, io)
    };
    // Bind events to handlers
    for (var category in eventHandlers) {
        var handler = eventHandlers[category].handler;
        for (var event in handler) {
            socket.on(event, handler[event]);
        }
    }

    socket.on('disconnecting', () => {
      var offId;
      for (var id in UserSockets){
        if (UserSockets[id] === socket){
          offId = id
          delete UserSockets[id]
        }
      }
      for(var id in UserSockets){
        UserSockets[id].emit('friend_offline', {userId: offId})
      }
    })

    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} Disconnected`);
    })
  });
}


module.exports = initSocket