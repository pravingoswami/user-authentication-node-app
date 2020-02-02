const mongoose = require('mongoose')
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username : {
        type : String,
        unique :true,
        required : true,
        minlength : 5
    },

    email : {
        type : String,
        unique : true,
        required : true,
        // how to check the format of the email
        validate : {
            validator : function(value){
                return validator.isEmail(value)
            },
            message : function(){
                return 'invalid email format'
            }
        }
    },

    password : {
        type : String,
        required : true,
        minlength : 6,
        maxlength : 128
    },

    createdAt : {
        type : Date,
        required : Date.now()
    }
})

const User = mongoose.model('User', userSchema)

module.exports = {
    User
}