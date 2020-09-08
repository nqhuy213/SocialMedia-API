const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    postedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true
    },
    text: {
      type: String,
      require: true
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
    }],
  },
  {
    timestamps: true
  }

)



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
    comments: [commentSchema],

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