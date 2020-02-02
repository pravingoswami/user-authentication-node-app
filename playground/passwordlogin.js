const bcryptjs = require('bcryptjs')

const encrypted = "$2a$10$zI6UeMqA3Jd8cYkpHxp7te3ElTf4U7D1XcdfrAkfu4xQU26eNWfhq"

const password = "secret123"

bcryptjs.compare(password, encrypted)
    .then(result => {
        console.log(result)
    })