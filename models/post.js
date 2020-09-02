const mongoose = require('mongoose')
const postSchema = new mongoose.Schema(
  {
    postedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    description: {
      type: String,
      required: true
    },
    image: {
      data: Buffer,
      contentType: String
    },
    isLiked: {
      type: Boolean,
      "default" : false
    },
    comments: [{
      commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      },
    }],
    likes: [{
      likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },
  {
    timestamps: true
  }
)


const Post = mongoose.model('Post', postSchema)

module.exports = Post