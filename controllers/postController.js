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
  let nextCount = 0
  if (req.query.nextCount) {
    nextCount = req.query.nextCount
  }

    if(postId){
      await Post.findOne({_id: postId})
          .populate({
            path: 'comments',
            populate : ({
              path: 'postedBy',
              select: 'firstName lastName profileImage'
            })
          })
          .populate({
            path: 'postedBy',
            select: 'firstName lastName profileImage'
          })
          .exec(function (err, post) {
            if (err) res.status(200).json({"message": err.message})
            else {
              if (post) {
                res.status(200).json(post)
              }
              else
                res.status(200).json({"message": "No post is found"})

            }
            })
    }else{
      if (postedBy) {
        // data = await Post.aggregate([{$match: {postedBy: mongoose.Types.ObjectId(postedBy)}}])
        // .select({__v: 0}).limit(10).skip(nextCount * 10).lean()
        console.log("dcm")
        await  Post.find({postedBy: postedBy})
            .populate({
              path: 'comments',
              populate : ({
                path: 'postedBy',
                select: 'firstName lastName profileImage'
              })
            })
            .populate({
              path: 'postedBy',
              select: 'firstName lastName profileImage'
            })
            .limit(10).skip(nextCount * 10)
            .exec(function (err, post) {
              if (err) res.status(400).json({"error": true, "message": err.message})
              else {
                if (post) {
                  console.log("Res post")
                  res.status(200).json(post)
                }
                else
                  res.status(200).json({"message": "No post is found"})
              }

            })
        
      } else {
        // data = await Post.aggregate([{$match: {}}])
        // .select({ __v: 0}).limit(10).skip(nextCount * 10).lean()
        await  Post.find()
            .populate({
              path: 'comments',
              populate : ({
                path: 'postedBy',
                select: 'firstName lastName profileImage'
              })
            })
            .populate({
              path: 'postedBy',
              select: 'firstName lastName profileImage'
            })
            .limit(10).skip(nextCount * 10)
            .exec(function (err, post) {
              if (err) res.status(400).json({"error": true,"message": err.message})
              else {
                if (post) {
                  res.status(200).json(post)
                }
                else
                  res.status(200).json({"message": "No post is found"})

              }

            })
      }

    }

  
  
}

exports.postLike = async (req, res, next) => {
  const {userId, token, body} = req
  if (!body.postId) {
    res.status(401).json({ "error": true, "message": "Missing 'postId' query!" })
  } else {
    try{
      const like = { likedBy: userId }
      let doc = await Post.find({ _id: body.postId, "likes.likedBy": userId})
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

exports.socketPostComment = async (req, res, next) => {
  const { userId, token, body } = req
  
  if (body.likes || body.postedBy || !body.postId || !body.text) {
    res.status(401).json({ "error": true, "message": "Invalid input!" })
  } else {
    try {
      const {postId, text} = body

      const newComment = new Comment()
      newComment.postedBy = userId
      newComment.postId = postId
      newComment.text = text
      await newComment.save()
      const post = await Post.findOneAndUpdate(
        {_id: postId},
        { $push : {comments: {_id: newComment._id}}},
        { new: true})
          .populate({
            path: 'comments',
            populate : ({
              path: 'postedBy',
              select: 'firstName lastName profileImage'
            })

          })
          .populate({
            path: 'postedBy',
            select: 'firstName lastName profileImage'
          })
      res.status(201).json(post)
    } catch (err) {
      res.status(401).json({"error": err.message})
    } 

  }
}