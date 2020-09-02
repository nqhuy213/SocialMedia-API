const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
  {
    email: {
      type:String,
      unique: true, 
      required: true,
      trim: true,
      lowercase: true
    },
    password: {
      type:String,
      required: true,
      minlength:8,
      trim: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String
    },
    phone: {
      type: String,
    },
    profileImage: {
      type: Buffer,
      contentType: String
    }
  },
  {
    timestamps: true
  }
)


const User = mongoose.model('User', userSchema)

module.exports = User