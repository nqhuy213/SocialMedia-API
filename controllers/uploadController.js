const path = require("path");
const fs = require("fs");
const { throwError } = require("../utils/errors");
const Image = require("../models/image");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

exports.validateUpload = (req, res, next) => {
  const { userId, token, body } = req;
  const { description, postId, commentId } = body;

  const validDescriptions = ["profileImage", "postImage", "commentImage"];

  if (validDescriptions.indexOf(description) > -1) {
    if (description === "profileImage") {
      if (!userId)
        res.status(400).json({ error: "true", message: "Missing 'userID'" });
      else next();
    } else if (description === "postImage") {
      if (!postId)
        res.status(400).json({ error: "true", message: "Missing 'postID'" });
      else next();
    } else if (description === "commentImage") {
      if (!commentId)
        res.status(400).json({ error: "true", message: "Missing 'commentID'" });
      else next();
    }
  } else {
    res.status(400).json({ error: "true", message: "Invalid description" });
  }
};

exports.uploadImage = async (req, res, next) => {
<<<<<<< HEAD
  const { userId, token, body } = req;
  const { description } = body;

  try {
    const tempPath = req.file.path;
    const fileType = path.extname(req.file.originalname).toLowerCase();
    if (fileType === ".png" || fileType === ".jpg") {
      // fs.rename(tempPath, targetPath, err => {
      //     if (err) return throwError(err.message, 400)
      // })
      let newImage = new Image();
      newImage.description = description;
      newImage.postedBy = userId;
      newImage.image = req.file;
      await newImage.save();

      // if (description === "profileImage") {
      //     await User.findOneAndUpdate(
      //         {_id: userId},
      //         { profileImage: newImage._id}
      //     )
      // } else if (description === "postImage") {
      //     await Post.findOneAndUpdate(
      //         {_id: postId},
      //         { image: newImage._id}
      //     )
      // } else if (description === "commentImage") {
      //     await Comment.findOneAndUpdate(
      //         {_id: commentId},
      //         {image: newImage._id}
      //     )
      // }
      res.status(200).json(newImage);
    } else {
      fs.unlink(tempPath, (err) => {
        if (err) return throwError(err.message, 400);
        res
          .status(200)
          .json({ error: true, message: "Only .png .jpg files are allowed!" });
      });
    }
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};
=======

    const {userId, token, body} = req
    const {description} = body

     try {
        const tempPath = req.file.path;
        const fileType = path.extname(req.file.originalname).toLowerCase()
        if (fileType === ".png" || fileType === ".jpg" ) {
            // fs.rename(tempPath, targetPath, err => {
            //     if (err) return throwError(err.message, 400)
            // })
            let newImage = new Image()
            newImage.description = description
            newImage.postedBy = userId
            newImage.image = req.file
            await newImage.save()

            // if (description === "profileImage") {
            //     await User.findOneAndUpdate(
            //         {_id: userId},
            //         { profileImage: newImage._id}
            //     )
            // } else if (description === "postImage") {
            //     await Post.findOneAndUpdate(
            //         {_id: postId},
            //         { image: newImage._id}
            //     )
            // } else if (description === "commentImage") {
            //     await Comment.findOneAndUpdate(
            //         {_id: commentId},
            //         {image: newImage._id}
            //     )
            // }
            res.status(200).json({"success" : true, "data":newImage})
        } else {
            fs.unlink(tempPath, err => {
                if (err) return throwError(err.message, 400);
                res.status(200).json({"error": true, "message": "Only .png .jpg files are allowed!"})
            })
        }
    } catch (err) {
         res.status(500).json({"error": true, "message": err.message})

    }

}
>>>>>>> 4b76516fb7d5acb72af6c88621d1f4456f635642
