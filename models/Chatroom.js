const mongoose = require('mongoose')

const ChatroomSchema = mongoose.Schema({
    name: {
        type: String,
        required: 'name is required!'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Chatroom' , ChatroomSchema)