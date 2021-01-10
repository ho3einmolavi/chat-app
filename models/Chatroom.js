const mongoose = require('mongoose')

const ChatroomSchema = mongoose.Schema({
    name: {
        type: String,
        required: 'name is required!',
        validate: {
            validator: async function (name) {
                const chatroom = await this.constructor.findOne({name});
                if (chatroom) {
                    if (this.id === chatroom.id) {
                        return true;
                    }
                    return false;
                }
                return true;
            },
            message: 'this chatroom is already exists'
        },
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Chatroom' , ChatroomSchema)