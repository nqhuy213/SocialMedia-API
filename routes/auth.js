const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')

const fs = require('fs');
const path = require('path');
const multer = require('multer');

router.post('/login', auth.login)

router.post('/register', auth.register)



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },

    filename: function (req, file, cb) {
        console.log(file);
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
// cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
        cb(null, file.originalname + '-' + Date.now() + '.' + extension);
    }
})

var upload = multer({ storage: storage }).single('avatar');

router.post('/image', function (req, res) {
    upload(req,res, function(err) {
        if (err) {
            console.log(err.message)
            res.send('error uploading file');
        } else {
            res.json({
                success : true,
                message : 'File uploaded!',
                file : req.file
            });
        }


    })
});

module.exports = router