const mongoose = require('mongoose')
const postSchema = new mongoose.Schema(
  {
    postedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    description: {
      type: String
    },
    image: {
      data: Buffer,
      contentType: String
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