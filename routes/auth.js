const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')

router.post('/login', auth.login)

router.post('/register', auth.register)

router.post('/post',auth.authenticate, auth.postPost)

router.get('/post',auth.authenticate, auth.getPost) //http://localhost:3001/auth/post?userId=5f4eef3307b018281806b82d&nextCount=0 //no userId query = getALl

router.post('/post/comment', auth.authenticate, auth.postComment )

router.get('/post/comment', auth.authenticate, auth.getComment)

module.exports = router