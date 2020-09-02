const { throwError, passError } = require('../utils/errors')
const User = require('../models/user')
const { verifyToken, generateToken } = require('../utils/token')
const bcrypt = require('bcryptjs');
const Post = require('../models/post');
const Comment = require('../models/comment')
const ObjectId = require('mongodb').ObjectID;

exports.postComment = async (req, res, next) => {
  const { userId, token, body } = req
  if (body.likes || body.postedBy || !req.query.postId) {
    res.status(401).json({ "error": true, "message": "Invalid input!" })
  } else {
    try {
      const newComment = new Comment(body)
      newComment.postedBy = userId
      await newComment.save()
      const comment = { commentId: newComment._id }
      await Post.updateOne(
        { _id: req.query.postId },
        { $push: { comments: comment } }
      )
      res.status(201).json({ success: true, message: 'Comment created' })
    } catch (err) {
      passError(err, next)
    }

  }
}


exports.getComment = async (req, res, next) => {
  const { userId, token, body } = req
  if (!req.query.postId) {
    res.status(401).json({ "error": true, "message": "Missing 'postId' in query" })
  } else {
    try {
      var nextCount = 0
      if (req.query.nextCount) nextCount = req.query.nextCount
      const data = await Comment.find({ postId: req.query.postId }).limit(5).skip(nextCount * 5)
      
      res.status(200).json(data)
    } catch (err) {
      passError(err, next)
    }

  }
}