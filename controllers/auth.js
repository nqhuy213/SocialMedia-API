const {throwError, passError} = require('../utils/errors')
const User = require('../models/user')
const {verifyToken, generateToken} = require('../utils/token')

/**Authenticate token */
exports.authenticate = async (req, res, next) => {
  try{
    let token = req.header('Authorization')
    if(!token){
      throwError('Token is not available or invalid', 401)
    }
    token = token.replace('Bearer ', '')
    const decoded = verifyToken(token)
    const user = User.findOne({_id: decoded})
    if(!user){
      throwError('Token is not available or invalid', 401)
    }
    req.token = token,
    req.userId = decoded
    next()
  }catch(err){
    passError(err, next)
  }
}

exports.login = async (req, res, next) => {
  try{
    const {email, password} = req.body
    const user = await User.findOne({email: email})
    if(!user){
      throwError('User not found', 401)
    }else{
      if(password === user.password){
        const token = generateToken(user)
        res.status(200).json({
          success: true,
          token
        })
      }else{
        throwError('Incorrect password', 401)
      }
    }
  }catch(err){
    passError(err, next)
  }
}


exports.register = async (req, res, next) => {
  const {email} = req.body
  try{
    if(await User.findOne({email: email})){
      throwError('User already existed', 409)
    }else{
      const newUser = new User(req.body)
      await newUser.save()
      res.status(201).json({success: true, message: 'User created'})
    }
  }catch (err){
    passError(err,next)
  }
}