const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')
const postController = require('../controllers/postController')

router.post('/',auth.authenticate, postController.postPost)

router.get('/',auth.authenticate, postController.getPost) //http://localhost:3001/auth/post?userId=5f4eef3307b018281806b82d&nextCount=0 //no userId query = getALl

router.post('/post-comment', auth.authenticate, postController.postComment )

router.post('/like', auth.authenticate, postController.postLike)

module.exports = router