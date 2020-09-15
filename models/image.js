const mongoose = require('mongoose')
const imageSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            require: true
        },
        postedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        postId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        },
        image: {
            fieldname: String,
            originalname: String,
            encoding: String,
            mimetype: String,
            destination: String,
            filename: String,
            path: String,
            size: Number,
            url: String
        }

    },
    {
        timestamps: true
    }
)


const Image = mongoose.model('Image', imageSchema)

module.exports = Image