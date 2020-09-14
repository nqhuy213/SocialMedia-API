var fs = require('fs');
var path = require('path');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("asd")
        console.log(file)
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

module.exports = upload