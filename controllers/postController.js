const { throwError, passError } = require('../utils/errors')
const { verifyToken, generateToken } = require('../utils/token')
const bcrypt = require('bcryptjs');
const Post = require('../models/post');
const Comment = require('../models/comment')
const User = require('../models/user')
const ObjectId = require('mongodb').ObjectID;


exports.postPost = async (req, res, next) => {  
    const {userId, token, body} = req
    if (body.postedBy || body.comments || body.likes)
      res.status(401).json({ "error": true, "message": "Invalid input!" })
    else {
      const newPost = new Post(body)
      newPost.postedBy = userId
      await newPost.save()
      res.status(201).json({ success: true, message: 'Post created' })
    }
}
  
exports.getPost = async (req, res, next) => {
  
  const userId = req.query.userId
  var nextCount = 0
  if (req.query.nextCount) {
    nextCount = req.query.nextCount
  }
  if (userId) {        
    const data = await Post.find({postedBy: userId}).select({comments: 0, __v: 0}).limit(10).skip(nextCount * 10)
    res.status(200).json(data)
  } else {
    const data = await Post.find().select({ __v: 0}).limit(10).skip(nextCount * 10)
    data = {...data, commentCount: data.comments.length}
    res.status(200).json(data)
  }
  
}

exports.postLike = async (req, res, next) => {
  const {userId, token, body} = req
  if (!req.query.postId) {
    res.status(401).json({ "error": true, "message": "Missing 'postId' query!" })
  } else {
    try{
      const like = { likedBy: userId }
      var doc = await Post.find({ _id: req.query.postId, "likes.likedBy": userId})
      if (doc.length === 0) {
        await Post.updateOne(
          { _id: req.query.postId },
          { $push: { likes: like } }
        )
        res.status(201).json({ success: true, message: 'Like added' })
      } else {
        await Post.updateOne(
          { _id: req.query.postId },
          { $pull: { likes: like } }
        )
        res.status(201).json({ success: true, message: 'Like removed' })
      }

      
      
    } catch (err) {
      throwError(err, next)
    }
  }
}