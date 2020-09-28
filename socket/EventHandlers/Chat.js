const User = require("../../models/user");
const hashStringArray = require("../../utils/hashArrayOfString");
const Chat = require("../../models/chat");
const { create } = require("../../models/user");

var ChatEventHandler = function (UserSockets, ChatSockets, socket, io) {
  this.UserSockets = UserSockets;
  this.ChatSockets = ChatSockets;
  this.socket = socket;
  this.io = io;
  this.handler = {
    join_chat: joinChat.bind(this),
    send_chat: sendChat.bind(this),
  };
};

/**
 * Join the chat room
 * @param {Array} participants Ids of all participants of the chat
 */
async function joinChat(participants) {
  const room = hashStringArray(participants);
  const c = await Chat.findOne({ _id: room });
  if (!c) {
    const newChat = new Chat({
      _id: room,
    });
    await newChat.save();
    for (var i = 0; i < participants.length; i++) {
      await Chat.updateOne(
        { _id: room },
        { $push: { participants: participants[i] } }
      );
    }
  }
  const chat = await Chat.findOne(
    { _id: room },
    { messages: { $slice: -10 } }
  ).populate({
    path: "participants",
    select: "firstName lastName profileImage",
  });
  this.socket.join(room);
  this.ChatSockets[room] = participants;
  this.socket.emit("join_chat", { chat });
  console.log(`Socket ${this.socket.id} joining Chat Room: ${room}`);
}

async function sendChat({ room, message }) {
  try {
    if (message.image) {
      /** Handle image */
    }
    const newChat = await Chat.findOneAndUpdate(
      { _id: room },
      { $push: { messages: {
        $each: [message],
        $slice: -10
      } } },
      { new: true }
    );
    this.io.to(room).emit('update_inbox', ({inbox: newChat}))
  } catch (error) {
    /** TODO Handle Errors */
    console.log(error);
  }
}

module.exports = ChatEventHandler;
