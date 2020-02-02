const express = require('express')
const setupDB = require('./config/databse')
const {userRouter} = require('./app/controllers/usersController')

const app = express()

app.use(express.json())
app.use('/users', userRouter)
setupDB()

const port = 3025

app.listen(port, () => {
    console.log('listening on the port', port)
})