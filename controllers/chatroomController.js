const mongoose = require('mongoose')
const Joi = require('joi')
const Chatroom = mongoose.model('Chatroom')


exports.createChatroom = async (req, res) => {
    const {name} = req.body
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    const result = schema.validate({name}, {abortEarly: false})

    if (result.error) {
        let messages = []
        result.error.details.forEach(err => {
            messages.push({name: err.context.key, message: err.message})
        })
        return res.send(messages)
    }

    const chatroom = new Chatroom({name})
    await chatroom.save().then(response => {
        return res.send(response)
    }).catch(err => {
        return res.status(500).send(err.message)
    })
}