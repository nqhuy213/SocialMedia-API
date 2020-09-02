const { throwError, passError } = require('../utils/errors')
const User = require('../models/user')
const { verifyToken, generateToken } = require('../utils/token')
const bcrypt = require('bcryptjs');
const Post = require('../models/post');
const Comment = require('../models/comment')
const ObjectId = require('mongodb').ObjectID;

/**Authenticate token */
exports.authenticate = async (req, res, next) => {
  try {
    let token = req.header('Authorization')
    if (!token) {
      throwError('Token is not available or invalid', 401)
    }
    token = token.replace('Bearer ', '')
    const decoded = verifyToken(token)
    const user = User.findOne({ _id: decoded })
    if (!user) {
      throwError('Token is not available or invalid', 401)
    }
    req.token = token,
    req.userId = decoded
    next()
  } catch (err) {
    passError(err, next)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
      throwError('User not found', 401)
    } else {
      const passwordValid = await bcrypt.compare(password, user.password)
      if (passwordValid) {
        const token = generateToken(user)
        res.status(200).json({
          success: true,
          token
        })
      } else {
        throwError('Incorrect password', 401)
      }
    }
  } catch (err) {
    passError(err, next)
  }
}

exports.register = async (req, res, next) => {
  const { email, password } = req.body
  try {
    if (await User.findOne({ email: email })) {
      throwError('User already existed', 409)
    } else {

      const newUser = new User(req.body)
      if (password) {
        newUser.password = bcrypt.hashSync(password, 10);
      }
      await newUser.save()
      res.status(201).json({ success: true, message: 'User created' })
    }
  } catch (err) {
    passError(err, next)
  }
}

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
    const data = await Post.find().select({comments: 0, __v: 0}).limit(10).skip(nextCount * 10)
    res.status(200).json(data)
  }
  
}

exports.postComment = async (req, res, next) => {
  const {userId, token, body} = req
  if ( body.likes || body.postedBy || !req.query.postId) {
    res.status(401).json({ "error": true, "message": "Invalid input!" })
  } else {
    try {
      const newComment = new Comment(body)
      newComment.postedBy = userId
      await newComment.save()
      const comment = {commentId: newComment._id}
      await Post.updateOne(
        {_id: req.query.postId},
        {$push: { comments: comment}}
      ) 
      res.status(201).json({ success: true, message: 'Comment created' })
    } catch (err) {
      passError(err, next)
    }
    
  }
}


exports.getComment = async (req, res, next) => {
  const {userId, token, body} = req
  if (!req.query.postId) {
    res.status(401).json({ "error": true, "message": "Missing 'postId' in query" })
  } else {
    try {
      var nextCount = 0
      if (req.query.nextCount) nextCount = req.query.nextCount
      const data = await Comment.find({postId: req.query.postId}).limit(5).skip(nextCount * 5)
      res.status(200).json(data)
    } catch (err) {
      passError(err, next)
    }
    
  }
}