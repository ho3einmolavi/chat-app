const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: 'name is required!'
    },
    email: {
        type: String,
        required: 'email is required!',
        validate: {
            validator: async function (email) {
                const user = await this.constructor.findOne({email});
                if (user) {
                    if (this.id === user.id) {
                        return true;
                    }
                    return false;
                }
                return true;
            },
            message: 'The specified email address is already in use.'
        },
    },
    password: {
        type: String,
        required: 'password is required!'
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema)