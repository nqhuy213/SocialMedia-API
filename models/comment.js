const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema(
  {
    postedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true
    },
    postId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      require: true
    },
    text: {
      type: String,
      require: true
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
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


const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment