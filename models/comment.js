const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema(
  {
    postedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String
    },
    image: {
      data: Buffer,
      contentType: String
    },
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


const Post = mongoose.model('Post', commentSchema)

module.exports = Post