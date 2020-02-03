const jwt = require('jsonwebtoken')

const token = '135'

console.log(jwt.verify(token, 'jwt@123'))