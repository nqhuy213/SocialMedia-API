
var User = function (UserSockets, socket, io){
  this.UserSockets = UserSockets
  this.socket = socket
  this.io = io
  this.handler = {
    user_login: login.bind(this),
    user_logout: logout.bind(this),
    like_post: likePost.bind(this)
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

async function likePost({userId, postId}) {
  /**Notify users that active and relevant to the post */
  
}

async function logout({userId}){
  this.socket.disconnect() // Disconnect the socket
  delete this.UserSockets[userId] //Remove the socket

  /**Find friends */
  for(var i in this.UserSockets){
    this.UserSockets[i].emit('friend_offline', {userId})
  }
}
module.exports = User