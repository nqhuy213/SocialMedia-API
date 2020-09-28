const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      require: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    messages: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        image: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Image",
        },
        text: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', ChatSchema)

module.exports = Chat