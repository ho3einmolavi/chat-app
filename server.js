require('dotenv').config()
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

const app = require('./app')


const server = app.listen(port, () => {
    console.log(`Running server on port ${port}`)
})

const io = require("socket.io")(server)
const jwt = require("jsonwebtoken")

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.query.token
        const payload = await jwt.verify(token, process.env.SECRET_KEY)
        socket.userId = payload.data
        next()
    } catch (err) {
        console.log(err)
    }
})

io.on("connection" , (socket) => {
    console.log(`connected ${socket.userId}`)

    socket.on("disconnect" , () => {
        console.log(`disconnected ${socket.userId}`)
    })
})