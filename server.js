const express = require('express')
const path = require('path')
const http = require('http')
const socket_io = require('socket.io')
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, roomUsers} = require('./utils/users')
const app = express()
const server = http.createServer(app)
const io = socket_io(server)

//add static folder
app.use(express.static(path.join(__dirname, 'public')))

//Run when client connects
io.on('connection', socket => {

    socket.on('joinChat', ({username, room}) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        //say welcome
        socket.emit('message', formatMessage('Bot', `Welcome to ${room} chat room`))

        //broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage('Bot', `${user.username} has joined`))

        //send users and chat info
        io.to(user.room).emit('roomUsers' , {
            room: user.room,
            users: roomUsers(user.room)
        })
    })

    //broadcast when a user disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if (user)
        {
            io.to(user.room).emit('message', formatMessage('Bot', `${user.username} has left the chat`))
        }

        //send users and chat info
        io.to(user.room).emit('roomUsers' , {
            room: user.room,
            users: roomUsers(user.room)
        })
    })

    //listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

})

const PORT = 3000 || process.env.PORT

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})