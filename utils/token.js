const jwt = require('jsonwebtoken')

exports.generateToken = (object) => {
  const {_id} = object
  const payload = {
    _id
  }
  return jwt.sign(payload, process.env.JWT_SECRET_KEY)
}

exports.verifyToken = (token) => {
  const _id = jwt.verify(token, process.env.JWT_SECRET_KEY)
  return _id
}