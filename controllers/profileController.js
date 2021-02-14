const { throwError, passError } = require('../utils/errors')
const User = require('../models/user')
const Post = require('../models/post')

exports.getProfile = async (req, res, next) => {
  const toGetUserId = req.params.userId
  /** User get their own profile */

  try {
    if(toGetUserId === req.userId._id){
      const auth = 'w'
      const userInfo = await User.findOne(
        {_id: toGetUserId}

      ).select({password: 0})
      const toSend = {
        auth,
        user: userInfo
      }

      res.status(200).json({success: true, data: toSend})
    }
    /** User get others profile */
    else{
      const auth = 'r'
    }

  } catch (error) {
    throwError(error, next)
  }
  
}


exports.editProfileImage = async (req, res, next) => {
  const toGetUserId = req.params.userId
  try {
    if(toGetUserId === req.userId._id){
      /** Edit profile iamge url in db */
      await User.updateOne({_id: toGetUserId}, {$set: {profileImageURL: req.body.imageURL}})
      res.status(200).json({success: true, message: 'Updated profile image successfully.'})
    }
    /** User get others profile */
    else{
      res.status(401).json({error: true, message: 'Unauthorized'})
    }

  } catch (error) {
    throwError(error, next)
  }
}