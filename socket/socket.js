const { listen } = require('socket.io')
const socketEvent = require('./socketEvent')
const Post = require('../models/post')
const Comment = require('../models/comment')
const { attachIsLiked } = require('../utils/attachIsLiked')
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
        ).lean()
      }else {
        toSend = await Post.findOneAndUpdate(
          { _id: postId },
          { $pull: { likes: like } },
          {new: true}
        ).lean()
      }
      io.sockets.to(postId).emit(socketEvent.updatePost, toSend)
    })
    //#endregion

    //#region Comment Post
    socket.on(socketEvent.sendComment, async (data) => {      
      const {text, postId, userId} = data
      try {
        const post = await Post.findOneAndUpdate(
          {_id: postId},
          { $push : {comments: {postedBy: userId, text: text}}},
          { new: true}
        )   
        res.status(201).json(post)
        io.sockets.to(data.postId).emit(socketEvent.updatePost, post)
      } catch (err) {
        res.status(401).json({"error": "True"})
      }
      
    })
    //#endregion

    socket.on('disconnect', () => {
      console.log('Socket Disconnected!!');
    })
  })

  

 
}

module.exports = socket