const bcryptjs = require('bcryptjs')

const password = 'secret123'

// randome genertae salt value
bcryptjs.genSalt(10)
    .then(salt => {
        console.log(salt)
        // hash mathod which will take two arguments
            // password and the salt value and give the hash value
        bcryptjs.hash(password, salt)
            .then(encryptedPassword => {
                console.log(encryptedPassword)
            })

            .catch(err => console.log(err))
    })

    .catch(err => console.log(err))