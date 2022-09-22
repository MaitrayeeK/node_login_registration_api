const jwt = require("jsonwebtoken")

// Get authorization token and verify token
const checktoken = (req, res, next) => {
    const auth = req.headers.authorization
    const token = auth.split(' ')[1]
    if(!token) {
        res.status(401).send({ message: "Please authenticate using valid token."})
    } else {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET)
            req.user = data.user;
            next()
        } catch (error) {
            console.log(error)
            res.status(401).send({ message: "Please authenticate using valid token."})
        }
    }
}

module.exports = checktoken