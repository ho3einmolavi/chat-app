const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {

    try {
        if (!req.headers.authorization) throw new Error("unauthorized")

        const token = req.headers.authorization.split(" ")[1]
        //Bearer hsgdfhgdhdjfhsj

        await jwt.verify(token, process.env.SECRET_KEY)
        next()
    } catch (err) {
        res.status(401).send({message: err.message})
    }

}