const { listen } = require('socket.io')
const socketEvent = require('./socketEvent')
const Post = require('../models/post')
var socket = {}

socket.init = function(server) {
  var io = require('socket.io').listen(server)
  io.sockets.on('connection', socket => {
    console.log('Socket Connected')

    //#region Join room
    socket.on(socketEvent.join, (room) => {
      console.log(`Socket ${socket.id} joining ${room}`);
      socket.join(room);
    });
    //#endregion

    //#region Like Post
    socket.on(socketEvent.sendLike, async (data) => {
      const {userId, postId, room} = data
      var toSend
      const like = { likedBy: userId }
      var doc = await Post.findOne({ _id: postId, "likes.likedBy": userId})
      if (!doc) {
        toSend = await Post.findOneAndUpdate(
          { _id: postId },
          { $push: { likes: like } },
          {new: true},
        )
      }else {
        toSend = await Post.findOneAndUpdate(
          { _id: postId },
          { $pull: { likes: like } },
          {new: true}
        )
      }

      io.sockets.to(postId).emit(socketEvent.updatePost, toSend)
    })
    //#endregion


    socket.on('disconnect', () => {
      console.log('Socket Disconnected!!');
    })
  })

  

 
}

module.exports = socket