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
    if(user.isNew){
        bcryptjs.genSalt(10)
        .then(salt => {
            bcryptjs.hash(user.password, salt)
                .then(encryptedPassword => {
                    user.password = encryptedPassword
                    next()
                })
        })
    } else {
        next()
    }

})

// own static method to find user findByCredentials

userSchema.statics.findByCredentials = function(email, password){
    const User = this
    // finding by email
    return User.findOne({email})
            .then(function(User){
                    if(!User){
                        return Promise.reject('invalid email or password')   
                    } 
                    return bcryptjs.compare(password, User.password)
                    .then(function(result){
                        if(result){
                            return Promise.resolve(User)
                        } else{
                            return Promise.reject('invalid email or password')
                        }
                    })
            })

            .catch( function(err){
                // we returning the promise object as return vaue
                return Promise.reject(err)
            } )
}


const User = mongoose.model('User', userSchema)

module.exports = {
    User
}