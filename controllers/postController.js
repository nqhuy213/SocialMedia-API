const { throwError, passError } = require('../utils/errors')
const Post = require('../models/post');
const Comment = require('../models/comment')


exports.postPost = async (req, res, next) => {  
    const {userId, token, body} = req
    if (body.postedBy || body.comments || body.likes)
      res.status(401).json({ "error": true, "message": "Invalid input!" })
    else {
      try {
        const newPost = new Post(body)
        newPost.postedBy = userId
        await newPost.save()
        const toSend = post = await Post.findOne(
          {_id: newPost._id},
          )
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
        res.status(201).json({ success: true, message: 'Post created', data: toSend })
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
      await Post.findOne({_id: postId}).sort({createdAt: -1})
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
          .populate({
            path: 'image'
          })
          .exec(function (err, post) {
            if (err) res.status(200).json({"error": true, "message": err.message})
            else {
              if (post) {
                res.status(200).json({"success": true, "data": post})
              }
              else
                res.status(200).json({"success": true, "message": "No post is found"})

            }
            })
    }else{
      if (postedBy) {
        // data = await Post.aggregate([{$match: {postedBy: mongoose.Types.ObjectId(postedBy)}}])
        // .select({__v: 0}).limit(10).skip(nextCount * 10).lean()
<<<<<<< HEAD
        await  Post.find({postedBy: postedBy})
=======
        let totalPost = await Post.countDocuments({postedBy: postedBy});
        await  Post.find({postedBy: postedBy})

>>>>>>> 4b76516fb7d5acb72af6c88621d1f4456f635642
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
            .populate({
              path: 'image'
            })
            .limit(10).skip(nextCount * 10)
            .exec(function (err, post) {
              if (err) res.status(400).json({"error": true, "message": err.message})
              else {
                if (post) {
                  if (nextCount * 10 + post.length < totalPost) res.status(200).json({"success": true,"data": post, "hasMore": true})
                  else res.status(200).json({"success": true, "data": post, "hasMore": false})
                }
                else
                  res.status(200).json({"success": true, "message": "No post is found"})
              }

            })
        
      } else {
        // data = await Post.aggregate([{$match: {}}])
        // .select({ __v: 0}).limit(10).skip(nextCount * 10).lean()
        let totalPost = await Post.countDocuments();
        await  Post.find().sort({createdAt: -1})
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
            .populate({
              path: 'image'
            })
            .limit(10).skip(nextCount * 10)
            .exec(function (err, post) {
              if (err) res.status(400).json({"error": true,"message": err.message})
              else {
                if (post) {
                  if (nextCount * 10 + post.length < totalPost) res.status(200).json({"posts": post, "hasMore": true})
                  else res.status(200).json({"success": true, "data": post, "hasMore": false})
                }
                else
                  res.status(200).json({"success": true, "message": "No post is found"})

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
      const {image, postId, text} = body

      const newComment = new Comment()
      newComment.postedBy = userId
      newComment.postId = postId
      newComment.text = text
      newComment.image = image
      await newComment.save()
      const post = await Post.findOneAndUpdate(
        {_id: postId},
        { $push : {comments: {_id: newComment._id}}},
        { new: true})
          .populate({
            path: 'comments',
            populate : ({
              path: 'postedBy',
              select: 'firstName lastName profileImage',
              populate: ({
                path: 'profileImage'
              })
            })

          })
          .populate({
            path: 'postedBy',
            select: 'firstName lastName profileImage',
            populate: ({
              path: 'profileImage'
            })
          })
          .populate({
            path: 'comments',
            populate : ({
              path: 'image'
            })
          })
          .populate({
            path: 'image'
          })
      res.status(201).json(post)
    } catch (err) {
      res.status(401).json({"error": err.message})
    } 

  }


}

exports.socketPostLikeComment = async (req, res, next) => {
  const {userId, token, body} = req
  if (!body.commentId || !body.postId) {
    res.status(401).json({ "error": true, "message": "Missing 'postId' query!" })
  } else {
    const {commentId, postId} = body
    try{
      /**Notify users that active and relevant to the post */
      const doc = await Comment.findOne({ _id: commentId, "likes.likedBy": userId})
      if(!doc){ //User did not like the post
        await Comment.findOneAndUpdate(
            {_id: commentId},
            { $push: { likes: {likedBy: userId} } },
            { new: true})
      }else{ //User already liked the post
        await Comment.findOneAndUpdate(
            {_id: commentId},
            { $pull: { likes: {likedBy: userId} } },
            { new: true})

      }
      const post = await Post.findOne({_id: postId})
          .populate({
            path: 'comments',
            populate : ({
              path: 'likes postedBy',
              select: 'firstName lastName profileImage',
              populate: ({
                path: 'likedBy',
                select: 'firstName lastName profileImage'
                })
              })
          })
          .populate({
            path: 'postedBy',
            select: 'firstName lastName profileImage'
          })

      res.status(201).json(post)

    } catch (err) {
      throwError(err, next)
    }
  }
}