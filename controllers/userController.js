const Joi = require('joi')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const {name, email, password} = req.body

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email({tlds: {allow: false}}),
        password: Joi.string().min(6).required()
    })
    const result = schema.validate({name, email, password}, {abortEarly: false})
    if (result.error) {
        let messages = []
        result.error.details.forEach(err => {
            messages.push({name: err.context.key, message: err.message})
        })
        return res.send(messages)
    }

    const user = new User({name, email, password: await bcrypt.hash(password, 8)})
    await user.save().then(response => {
        return res.send(response)
    }).catch(err => {
        return res.status(400).send(err)
    })
}

exports.login = async (req, res) => {
    let {email, password} = req.body

    const schema = Joi.object({
        email: Joi.string().email({tlds: {allow: false}}),
        password: Joi.string().min(6).required()
    })
    const result = schema.validate({email, password}, {abortEarly: false})
    if (result.error) {

        let messages = []
        result.error.details.forEach(err => {
            messages.push({name: err.context.key, message: err.message})
        })
        return res.send(messages)
    }


    const user = await User.findOne({email})
    if (!user) {
        throw "this user does not exist"
    } else {
        const isEqual = await bcrypt.compare(password, user.password)
        if (!isEqual) throw "email and password is not matched"
        const token = await jwt.sign({data: user.id}, process.env.SECRET_KEY, {expiresIn: 60 * 60 * 24})
        return res.send({
            message: 'user logged in successfully',
            token
        })
    }
}