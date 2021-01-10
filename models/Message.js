const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    chatroom_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'chatroom id is required!',
        ref: 'Chatroom'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'user id is required!',
        ref: 'User'
    },
    message: {
        type: String,
        required: 'message is required!'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Message' , messageSchema)