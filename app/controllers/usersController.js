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



//localhost:3000/user/logout



module.exports = {
    userRouter : router
}