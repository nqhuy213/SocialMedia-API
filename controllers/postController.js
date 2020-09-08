const { throwError, passError } = require('../utils/errors')
const { verifyToken, generateToken } = require('../utils/token')
const bcrypt = require('bcryptjs');
const Post = require('../models/post');
const Comment = require('../models/comment')
const User = require('../models/user')
const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const { attachIsLiked } = require('../utils/attachIsLiked');


exports.postPost = async (req, res, next) => {  
    const {userId, token, body} = req
    if (body.postedBy || body.comments || body.likes)
      res.status(401).json({ "error": true, "message": "Invalid input!" })
    else {
      try {
        const newPost = new Post(body)
        newPost.postedBy = userId
        await newPost.save()
        res.status(201).json({ success: true, message: 'Post created', data: newPost })
      } catch (err) {
        throwError(err, next)
      }
      
    }
}
  
exports.getPost = async (req, res, next) => {
  const userId = req.userId
  const postedBy = req.query.postedBy
  const postId = req.query.postId
  var nextCount = 0
  if (req.query.nextCount) {
    nextCount = req.query.nextCount
  }
  try {
    if(postId){
      let result = await Post.findOne({_id: postId}).lean()
      let comments = await Comment.find({postId: postId}).lean()
      result.comments = comments
      res.status(200).json(result)
    }else{
      var data;
      if (postedBy) {        
        data = await Post.aggregate([{$match: {postedBy: mongoose.Types.ObjectId(postedBy)}}])
        // .select({__v: 0}).limit(10).skip(nextCount * 10).lean()   
        
      } else {
        data = await Post.aggregate([{$match: {}}])
        // .select({ __v: 0}).limit(10).skip(nextCount * 10).lean()
        
      }
      var result = []
      for (var i = 0; i < data.length; i++) {
        let post = data[i]
        post = attachIsLiked(post, userId._id)
        result.push(post)
      }  
      res.status(200).json(result)   

    }
  } catch (err) {
    throwError(err, next)
  }
  
  
}

exports.postLike = async (req, res, next) => {
  const {userId, token, body} = req
  if (!body.postId) {
    res.status(401).json({ "error": true, "message": "Missing 'postId' query!" })
  } else {
    try{
      const like = { likedBy: userId }
      var doc = await Post.find({ _id: body.postId, "likes.likedBy": userId})
      if (doc.length === 0) {
        await Post.updateOne(
          { _id: body.postId },
          { $push: { likes: like } }
        )
        res.status(201).json({ success: true, message: 'Like added' })
      } else {
        await Post.updateOne(
          { _id: body.postId },
          { $pull: { likes: like } }
        )
        res.status(201).json({ success: true, message: 'Like removed' })
      }

      
      
    } catch (err) {
      throwError(err, next)
    }
  }
}

exports.postComment = async (req, res, next) => {
  const { userId, token, body } = req
  
  if (body.likes || body.postedBy || !body.postId || !body.text) {
    res.status(401).json({ "error": true, "message": "Invalid input!" })
  } else {
    
    

  }
}