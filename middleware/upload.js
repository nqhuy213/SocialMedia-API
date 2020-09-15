const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage(
    {
        destination: path.join(__dirname, '../uploads'),
        filename: function ( req, file, cb ) {
            //req.body is empty... here is where req.body.new_file_name doesn't exists
            cb( null, `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}` );
        }
    }
);

// const upload = multer({
//     dest: path.join(__dirname, '../uploads')
//     // you might also want to set some limits: https://github.com/expressjs/multer#limits
// });

const upload = multer( { storage: storage } );

module.exports = upload