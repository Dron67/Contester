const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    login:{
        type: String,
        required: true,
        unique:true
    },
    lastName:{
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true

    },
    secondName:{
        type: String,
        default: ''
    },
    organization:{
        type: String,
        default: ''
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: Boolean,
        default: false
    },
    imageSrc: {
        type: String,
        default: 'uploads/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png'
    }
})

module.exports = mongoose.model('users',userSchema)