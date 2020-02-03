const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
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

    // if we can create multiple token then we can allow to user to login from multiple devices
    token : [
        {
            token : {
                type : String
            },
            createdAt : {
                type : Date,
                default : Date.now()
            }
        }
    ],

    createdAt : {
        type : Date,
        default : Date.now()
    }
})

// mongoose pre hooks this will call before the save method of the controller 

userSchema.pre('save', function(next){
    // this is refer to the conroller user
    const user = this
    // user.isNew() will check the user if new user then and then encrypt the password otherwise returning the next()
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


// own instance method

userSchema.methods.generateToken = function(){
    const user = this
    // creating the user token data
    const tokenData = {
        id : user._id,
        username : user.username,
        createdAt : new Date()
    }

    // 'jwt@123' is a secret key for the generate the token
    const token = jwt.sign(tokenData, 'jwt@123')
    
    // pushing the token into the user
    user.token.push({token})

    return user.save()
        // here we resolving the promise and send back the token information
        .then(user => Promise.resolve(token))
        .catch(err => Promise.reject(err))
}

const User = mongoose.model('User', userSchema)

module.exports = {
    User
}