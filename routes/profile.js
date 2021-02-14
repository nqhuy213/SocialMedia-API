const express = require('express')
const router = express.Router()
const profile = require('../controllers/profileController')
const auth = require('../controllers/auth')

router.get('/:userId',auth.authenticate, profile.getProfile)
router.post('/:userId/edit-profile-image', auth.authenticate, profile.editProfileImage)


module.exports = router