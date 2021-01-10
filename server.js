require('dotenv').config()
const app = require('./app')
const mongoose = require('mongoose')
const port = 3000 || process.env.PORT


mongoose.connect(process.env.DATABASE, {useUnifiedTopology: true, useNewUrlParser: true})
mongoose.connection.on('error', err => {
    console.log("Mongoose connection error: ", err.message)
})

mongoose.connection.once('open', () => {
    console.log("MongoDB is connected")
})

//Bring in all the models
require('./models/User')
require('./models/Chatroom')
require('./models/Message')

app.listen(port, () => {
    console.log(`Running server on port ${port}`)
})