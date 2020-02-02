const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const Schema = mongoose.Schema
mongoose.set('useCreateIndex', true)

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
        default : Date.now()
    }
})

// mongoose pre hooks this will call before the save method of the controller 

userSchema.pre('save', function(next){
    // this is refer to the conroller user
    const user = this
    bcryptjs.genSalt(10)
        .then(salt => {
            bcryptjs.hash(user.password, salt)
                .then(encryptedPassword => {
                    user.password = encryptedPassword
                    next()
                })
        })

})

const User = mongoose.model('User', userSchema)

module.exports = {
    User
}