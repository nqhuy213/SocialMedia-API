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
