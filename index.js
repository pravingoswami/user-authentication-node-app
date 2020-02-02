const express = require('express')
const setupDB = require('./config/databse')

const app = express()

app.use(express.json())
setupDB()

const port = 3025

app.listen(port, () => {
    console.log('listening on the port', port)
})