const jwt = require('jsonwebtoken')

const tokenData = {
    id : 1,
    username : 'user1'
}

// here jwt@123 is a secret password to generate the token with token data
const token = jwt.sign(tokenData, 'jwt@123')

console.log(token)
console.log(jwt.decode(token, 'jwt@123'))