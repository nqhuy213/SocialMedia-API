const Post = require("../../models/post")

var User = function (UserSockets, socket, io){
  this.UserSockets = UserSockets
  this.socket = socket
  this.io = io
  this.handler = {
    user_login: login.bind(this),
    user_logout: logout.bind(this),
    like_post: likePost.bind(this),
    comment_post: commentPost.bind(this),
    like_comment: likeComment.bind(this),
    add_post: addPost.bind(this)
  }
}


async function login({userId}){
  /**Notify friends */
  this.UserSockets[userId] = this.socket // Add the socket
  for(var i in this.UserSockets){
    this.UserSockets[i].emit('friend_online', {userId})
  }
  let activeUser = Object.keys(this.UserSockets)
  this.UserSockets[userId].emit('active_friends', activeUser)
} 

async function logout({userId}){
  this.socket.disconnect() // Disconnect the socket
  delete this.UserSockets[userId] //Remove the socket

  /**Find friends */
  for(var i in this.UserSockets){
    this.UserSockets[i].emit('friend_offline', {userId})
  }
}

async function addPost({userId, description}){
  const newPost = new Post({postedBy: userId, description: description}) 
  await newPost.save()
  const toSend = await Post.findOne({_id: newPost._id}).populate('postedBy')
  /**Notify all relevant users */
  for(var i in this.UserSockets){
    this.UserSockets[i].emit('post_added', toSend)
  }
}

async function likePost({userId, postId}) {
  /**Notify users that active and relevant to the post */
  const doc = await Post.findOne({ _id: postId, "likes.likedBy": userId})
  var post
  if(!doc){ //User did not like the post
    post  = await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { likes: {likedBy: userId} } },
      {new: true},).populate('postedBy').lean()
  }else{ //User already liked the post
    post = await Post.findOneAndUpdate(
      {_id: postId},
      { $pull: { likes: {likedBy: userId} } },
      {new: true}
    ).populate('postedBy').lean()
  }
  /**TODO: Send to all relevant users (send to all users for now) */
  for (socket in this.UserSockets){
    this.UserSockets[socket].emit('update_post', post)
  }
}

async function commentPost({postId, userId, text}){
  const post = await Post.findOneAndUpdate(
    {_id: postId},
    { $push : {comments: {postedBy: userId, text: text}}},
    { new: true}
  ).populate('postedBy')
  /**TODO: Send to all relevant users (send to all users for now) */
  for (socket in this.UserSockets){
    this.UserSockets[socket].emit('update_post', post)
  }
}

async function likeComment({postId, commentId, userId}){
  
}


module.exports = User