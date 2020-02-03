const express = require('express')
const router = express.Router()
const {User} = require('../model/user')

// localhost:3000/users/register
router.post('/register', function(req, res){
    const body = req.body
    const user = new User(body)
    user.save()
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

//localhost:3000/user/login

router.post('/login', function(req, res){

    const body = req.body
    User.findByCredentials(body.email, body.password)
        .then(user => user.generateToken())
            // here we will send back the empty object and sending token into the header
            // .then(token => res.setHeader('x-auth', token).send({}))
            .then(token => res.setHeader('x-auth', token).send({}))
            .catch(err => res.json(err))


    // finding the user by email id 
    // User.findOne({email : body.email})
    //     // .then(user => user ? res.json(user) : res.status('404').send())
    //     .then(user => {
    //             if(!user){
    //                 res.status('404').send('invaalid email or password')
    //             }
    //             // first pass the plain and after that passing the encrypted
    //             bcryptjs.compare(body.password, user.password)
    //                 .then(result => result ? res.json(user) : res.status('404').send('invalid email or password'))
    //                 .catch(err => res.json(err))
    //         }
    //     )
    //     .catch(err => res.json(err))
})


// localhost:3000/user/account

router.get('/account', function(req, res){
    // checking for the token passed in the header or not
    const token = req.header('x-auth')
    if(token){
        // own static method
        User.findByToken(token)
            .then(user => res.send(user))
            .catch(err => res.status('401').send(err))
    } else {
        // 401 for unauthorised user
        res.status('401').send('failure')
    }
})


//localhost:3000/user/logout



module.exports = {
    userRouter : router
}