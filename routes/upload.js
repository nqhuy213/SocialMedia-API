const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')
const uploadController = require('../controllers/uploadController')
const upload = require('../middleware/upload')

router.post('/',upload.single("image"), auth.authenticate, uploadController.uploadImage)
<<<<<<< HEAD
=======

>>>>>>> 4b76516fb7d5acb72af6c88621d1f4456f635642

//Multi-part: image (image file), description (profileImage  || postImage || commentImage), postId (if desc = profile), commentId (desc = comment)

module.exports = router