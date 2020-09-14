const Post = require("../../models/post")
const User = require("../../models/user")

var UserEventHandler = function (UserSockets, socket, io){
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
  console.log(`User ${userId} logged in`);
  /**Notify friends */
  this.UserSockets[userId] = this.socket // Add the socket
  const thisUser = await User.findOne({_id: userId}).select({firstName: 1, lastName:1, email:1, profileImage:1})
  for(var i in this.UserSockets){
    if(i !== userId){
      this.UserSockets[i].emit('friend_online', thisUser)
    }
  }
  /**Send all the active friends to the logged in user */
  let activeUser = []
  for (var id in this.UserSockets){
    const user = await User.findOne({_id: id}).select({firstName: 1, lastName:1, email:1, profileImage:1})
    activeUser.push(user)
  }
  this.UserSockets[userId].emit('active_friends', activeUser)

} 

async function logout({userId}){
  console.log(`User ${userId} logged out`);
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

async function commentPost({userId, postId, commentData}){
  const post = await Post.findOneAndUpdate(
    {_id: postId},
    { $push : {comments: {postedBy: userId, text: commentData.text}}},
    { new: true}
  ).populate('postedBy')
  /**TODO: Send to all relevant users (send to all users for now) */
  for (socket in this.UserSockets){
    this.UserSockets[socket].emit('update_post', post)
  }
}

async function likeComment({commentId, postId, userId}){
  
}


module.exports = UserEventHandler